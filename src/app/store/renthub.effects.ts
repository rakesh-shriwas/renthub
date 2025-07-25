import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommonService } from '../services/common.service';
import {
  addFavorite,
  addRemoveOperationStatus,
  createNewPost,
  createPostFailure,
  createPostSuccess,
  loadFavorites,
  loadFavoritesFailure,
  loadFavoritesSuccess,
  loadFeaturedPosts,
  loadFeaturedPostsSuccess,
  loadPosts,
  loadPostsByUserId,
  loadPostsByUserIdSuccess,
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

  loadFeaturedPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFeaturedPosts),
      mergeMap(() =>
        this.service.getFeaturedPosts().pipe(
          map((featuredPosts: IPostResponse[]) => {
            return loadFeaturedPostsSuccess({ featuredPosts });
          })
        )
      )
    )
  );

  loadPostByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPostsByUserId),
      mergeMap(({ userId }) =>
        this.service.getPostByUserId(userId).pipe(
          map((posts: IPostResponse[]) => {
            return loadPostsByUserIdSuccess({ posts });
          })
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createNewPost),
      switchMap(({ payload }) =>
        this.service.createNewPost(payload).pipe(
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
          map(() => updateExistingPostSuccess({ status: true })),
          catchError((error) => of())
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
          map(() => addRemoveOperationStatus({ status: true })),
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
          map(() => addRemoveOperationStatus({ status: true })),
          catchError(() => of({ type: '[Favorite] Remove Failed' }))
        )
      )
    )
  );
}
