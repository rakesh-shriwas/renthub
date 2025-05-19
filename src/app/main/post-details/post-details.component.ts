import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { PostDetailsComponentStore } from './details.store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, Location, NgIf } from '@angular/common';
import { IPostResponse } from '../../models/post.vm';
import { ICommentRequest, ICommentResponse } from '../../models/comment.vm';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { CommonService } from '../../services/common.service';
import { IUser } from '../../models/user.vm';

@Component({
  selector: 'app-post-details',
  imports: [
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    CommentsListComponent,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
  providers: [PostDetailsComponentStore],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly activatedRoute = inject(ActivatedRoute);
  readonly componentStore = inject(PostDetailsComponentStore);
  private service = inject(CommonService);
  private location = inject(Location);
  currentPostId: number;

  /** Store Post Details Inprogress state */
  readonly isLoading$: Observable<boolean> =
    this.componentStore.selectIsLoading$;
  /** Store Post Details*/
  readonly postDetails$: Observable<IPostResponse[]> =
    this.componentStore.selectPostDetails$;
  /** Store Post Comments */
  readonly postComments$: Observable<ICommentResponse[]> =
    this.componentStore.selectPostComments$;
  /** Store Comment Successfully */
  readonly postCommentSuccessfully$: Observable<boolean> =
    this.componentStore.selectPostCommentSuccessfully$;
  /** Store Comment loading state */
  readonly commentIsLoading$: Observable<boolean> =
    this.componentStore.selectCommentIsLoading$;

  userDetails: IUser;
  postId: number;
  
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.postId = params?.['id'];
        this.currentPostId = this.postId;
        this.componentStore.loadPostDetailsById({ postId: this.currentPostId });
        this.componentStore.loadPostCommentsById({
          postId: this.currentPostId,
        });
      });

    this.postCommentSuccessfully$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.componentStore.loadPostCommentsById({
            postId: this.currentPostId,
          });
        }
      });
    this.service.getAuthenticateUser().subscribe((res) => {
      if (res) {
        this.userDetails = res;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  postComment(comment: string): void {
    const obj: ICommentRequest = {
      createdAt: new Date().toISOString(),
      postId: this.postId,
      userId: this.userDetails?.id,
      userName: this.userDetails?.name,
      comment,
    };
    this.componentStore.commentOnPost(obj);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
