import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommonService } from '../services/common.service';
import {
  createPost,
  createPostFailure,
  createPostSuccess,
  loadPosts,
  loadPostSuccess,
  updateExistingPost,
  updateExistingPostSuccess,
} from './renthub.action';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { IPostResponse } from '../models/post.vm';

@Injectable()
export class PostEffects {
  actions$ = inject(Actions);
  service = inject(CommonService);
  constructor() {}

  /**
   * Load all post
   *
   * @memberof PostEffects
   */
  loadPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPosts),
      mergeMap(() =>
        this.service.getPosts().pipe(
          map((posts: IPostResponse[]) => {
            return loadPostSuccess({ posts });
          })
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPost),
      switchMap(({payload}) =>
        this.service.createPost(payload).pipe(
          map((post) => createPostSuccess({post})),
          catchError((error) => of(createPostFailure({ error: error.message })))
        )
      )
    )
  );
  updateExistingPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateExistingPost),
      switchMap(({payload, postId}) =>
        this.service.updatePostById(postId, payload).pipe(
          map((res) => updateExistingPostSuccess({status: true})),
          catchError((error) => of(createPostFailure({ error: error.message })))
        )
      )
    )
  );
}
