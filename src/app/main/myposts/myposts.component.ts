import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonService } from '../../services/common.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IPostResponse } from '../../models/post.vm';
import {
  selectPosts,
  selectUpdateExistingPostSuccess,
} from '../../store/renthub.selectors';
import { loadPosts, loadPostsByUserId } from '../../store/renthub.action';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { NotRecordFoundComponent } from '../not-record-found/not-record-found.component';

@Component({
  selector: 'app-myposts',
  imports: [PostCardComponent, NotRecordFoundComponent],
  templateUrl: './myposts.component.html',
  styleUrl: './myposts.component.scss',
})
export class MypostsComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private service = inject(CommonService);
  private destroy$ = new Subject<void>();

  loggedInUserDetails = signal<any>(null);
  myPostList = signal<IPostResponse[]>([]);
  userId: number;
  updateExistingPostSuccess$: Observable<any> = this.store.select(
    selectUpdateExistingPostSuccess
  );

  /** Store Post Data */
  posts$: Observable<IPostResponse[]> = this.store.select(selectPosts);

  ngOnInit(): void {
    this.service.getAuthenticateUser().subscribe((res) => {
      if (res) {
        this.loggedInUserDetails.set(res);
        this.userId = res?.id;
        this.store.dispatch(loadPostsByUserId({ userId: res?.id }));
      }
    });
    this.posts$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res?.length) {
        const filterData = res.filter((post) => post.userId === +this.userId);
        this.myPostList.set(filterData);
      }
    });
    this.updateExistingPostSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.store.dispatch(loadPostsByUserId({ userId: this.userId }));
        }
      });
  }

  viewDetails(postId: number): void {
    this.router.navigate(['/app', 'my', 'posts', postId]);
  }

  editPost(post: IPostResponse): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      maxWidth: '950px',
      autoFocus: false,
      data: post,
      restoreFocus: false
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
