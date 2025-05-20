import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommonService } from '../services/common.service';
import {
  addFavorite,
  addRemoveOperationStatus,
  createPost,
  createPostFailure,
  createPostSuccess,
  loadFavorites,
  loadFavoritesFailure,
  loadFavoritesSuccess,
  loadPosts,
  loadPostSuccess,
  removeFavorite,
  updateExistingPost,
  updateExistingPostSuccess,
} from './renthub.action';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { IPostResponse } from '../models/post.vm';
import { IFavoritesResponse } from '../models/favorites.vm';

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
      switchMap(({ payload }) =>
        this.service.createPost(payload).pipe(
          map((post) => createPostSuccess({ post })),
          catchError((error) => of(createPostFailure({ error: error.message })))
        )
      )
    )
  );
  updateExistingPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateExistingPost),
      switchMap(({ payload, postId }) =>
        this.service.updatePostById(postId, payload).pipe(
          map((res) => updateExistingPostSuccess({ status: true })),
          catchError((error) => of(createPostFailure({ error: error.message })))
        )
      )
    )
  );

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFavorites),
      switchMap(({ userId }) =>
        this.service.getFavoriteById(userId).pipe(
          map((favorites: IFavoritesResponse[]) =>
            loadFavoritesSuccess({ favorites })
          ),
          catchError((error) => of(loadFavoritesFailure(error)))
        )
      )
    )
  );

  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFavorite),
      mergeMap(({ favorite }) =>
        this.service.addFavorite(favorite).pipe(
          map(() => (addRemoveOperationStatus({status: true}))),
          catchError(() => of({ type: '[Favorite] Add Failed' }))
        )
      )
    )
  );

  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFavorite),
      mergeMap(({ postId }) =>
        this.service.removeFavorite(postId).pipe(
          map(() => (addRemoveOperationStatus({status: true}))),
          catchError(() => of({ type: '[Favorite] Remove Failed' }))
        )
      )
    )
  );
}
