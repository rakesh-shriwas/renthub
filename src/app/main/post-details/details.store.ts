import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { IPostResponse } from '../../models/post.vm';
import { ICommentRequest, ICommentResponse } from '../../models/comment.vm';
import { ComponentStore } from '@ngrx/component-store';

interface PostDetailsInitialState {
  postDetails: IPostResponse[];
  isLoading: boolean;
  postComments: ICommentResponse[];
  postCommentSuccessfully: boolean;
  commentIsLoading: boolean;
}

@Injectable()
export class PostDetailsComponentStore extends ComponentStore<PostDetailsInitialState> {
  private service = inject(CommonService);

  constructor() {
    super({
      postDetails: [],
      isLoading: false,
      postComments: [],
      postCommentSuccessfully: false,
      commentIsLoading: false
    });
  }

  readonly selectPostDetails$: Observable<IPostResponse[]> = this.select(
    (state) => state.postDetails
  );
  readonly selectIsLoading$: Observable<boolean> = this.select(
    (state) => state.isLoading
  );
  readonly selectPostComments$: Observable<ICommentResponse[]> = this.select(
    (state) => state.postComments
  );

  readonly selectPostCommentSuccessfully$: Observable<boolean> = this.select((state) => state.postCommentSuccessfully);
  readonly selectCommentIsLoading$: Observable<boolean> = this.select((state) => state.commentIsLoading);

  readonly loadPostDetailsById = this.effect(
    (data: Observable<{ postId: number }>) =>
      data.pipe(
        switchMap((req: { postId: number }) => {
          this.setState((state) => ({
            ...state,
            isLoading: true,
          }));

          return this.service.getPostDetailsById(req.postId).pipe(
            tap({
              next: (res) => {
                this.setState((state) => ({
                  ...state,
                  isLoading: false,
                  postDetails: res,
                }));
              },
              error: () => {
                this.setState((state) => ({
                  ...state,
                  isLoading: false,
                  postDetails: [],
                }));
              },
            })
          );
        })
      )
  );

  readonly loadPostCommentsById = this.effect(
    (data: Observable<{ postId: number }>) =>
      data.pipe(
        switchMap((req: { postId: number }) => {
          this.setState((state) => ({
            ...state,
            commentIsLoading: true,
          }));
          return this.service.getCommentsByPostId(req.postId).pipe(
            tap({
              next: (comments) => {
                this.setState((state) => ({
                  ...state,
                  postComments: comments,
                  commentIsLoading: false,
                }));
              },
              error: () => {
                this.setState((state) => ({
                  ...state,
                  postComments: [],
                  commentIsLoading: false,
                }));
              },
            })
          );
        })
      )
  );

  readonly commentOnPost = this.effect((data: Observable<ICommentRequest>) =>
    data.pipe(
      switchMap((req: ICommentRequest) => {
        this.setState((state) => ({
          ...state,
          postCommentSuccessfully: false
        }));
        return this.service.postAComment(req).pipe(
          tap({
            next: (comments: ICommentResponse[]) => {
              this.setState((state) => ({
                ...state,
                postCommentSuccessfully: true,
              }));
            },
            error: () => {
              this.setState((state) => ({
                ...state,
                postCommentSuccessfully: false,
              }));
            },
          })
        );
      })
    )
  );
}
