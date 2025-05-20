import { Component, inject, signal } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { IPostResponse } from '../../models/post.vm';
import { selectPosts, selectUpdateExistingPostSuccess } from '../../store/renthub.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';
import { loadPosts } from '../../store/renthub.action';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { NotRecordFoundComponent } from '../not-record-found/not-record-found.component';

@Component({
  selector: 'app-main',
  imports: [PostCardComponent, NotRecordFoundComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private store = inject(Store);
  readonly dialog = inject(MatDialog);
  private router = inject(Router);
  private service = inject(CommonService);
  private destroy$ = new Subject<void>();

  loggedInUserDetails = signal<any>(null);
  myPostList = signal<IPostResponse[]>([]);
  userId: number;

  /** Store Post Data */
  posts$: Observable<IPostResponse[]> = this.store.select(selectPosts);
  updateExistingPostSuccess$: Observable<any> = this.store.select(selectUpdateExistingPostSuccess);

  ngOnInit(): void {
    this.store.dispatch(loadPosts());
    this.service.getAuthenticateUser().subscribe((res) => {
      if (res) {
        this.loggedInUserDetails.set(res);
        this.userId = res?.id;
      }
    });
    this.posts$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.myPostList.set([]);
      if (res?.length) {
        // const filterData = res.filter((post) => post.userId === +this.userId);
        this.myPostList.set(res);
      }
    });
    this.updateExistingPostSuccess$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.store.dispatch(loadPosts());
      }
    });
  }

  viewDetails(postId: number): void {
    this.router.navigate(['/app', 'post', postId]);
  }

  editPost(post: IPostResponse): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      maxWidth: '950px',
      autoFocus: false,
      data: post,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.store.dispatch(loadPosts());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
