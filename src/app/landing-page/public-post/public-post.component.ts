import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectPosts } from '../../store/renthub.selectors';
import { IPostResponse } from '../../models/post.vm';
import { Observable } from 'rxjs/internal/Observable';
import { loadPosts } from '../../store/renthub.action';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../models/user.vm';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';
import { PostCardComponent } from '../../main/post-card/post-card.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-public-post',
  imports: [PostCardComponent, PageNotFoundComponent],
  templateUrl: './public-post.component.html',
  styleUrl: './public-post.component.scss',
})
export class PublicPostComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private service = inject(CommonService);
  private destroy$ = new Subject<void>();

  myPostList = signal<IPostResponse[]>([]);
  loggedInUser = signal<any>(null);
  loggedInUserDetails: IUser;

  /** Store Post Data */
  posts$: Observable<IPostResponse[]> = this.store.select(selectPosts);
  ngOnInit(): void {
    this.store.dispatch(loadPosts());

    this.posts$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res?.length) {
          this.myPostList.set(res);
          this.loggedInUser.set(this.loggedInUserDetails);
        
      }
    });
  }

  viewDetails(postId: number): void {
    this.router.navigate(['/public', 'post', postId]);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
