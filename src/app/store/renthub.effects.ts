import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommonService } from '../services/common.service';
import {
  createPost,
  createPostFailure,
  createPostSuccess,
  loadPosts,
  loadPostSuccess,
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
}
