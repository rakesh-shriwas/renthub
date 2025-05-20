import { createAction, props } from '@ngrx/store';
import { IPostResponse } from '../models/post.vm';
import { IFavoritesResponse } from '../models/favorites.vm';

/** Post Action */
export const loadPosts = createAction('[Posts] Load Posts');
export const loadPostSuccess = createAction(
  '[Posts] Load Posts Success',
  props<{ posts: IPostResponse[] }>()
);

/** Create Post */
export const createPost = createAction(
  '[Post] Create New Post',
  props<{ payload: any }>()
);
export const createPostSuccess = createAction(
  '[Post] Create New Post Success',
  props<{ post: IPostResponse }>()
);
export const createPostFailure = createAction(
  '[Post] Create New Post Failure',
  props<{ error: string }>()
);

export const updateExistingPost = createAction(
  '[Post] Create New Post',
  props<{ payload: any; postId: number }>()
);
export const updateExistingPostSuccess = createAction(
  '[Post] Create New Post',
  props<{ status: boolean }>()
);

/** Favorites */

export const loadFavorites = createAction(
  '[Favorite] Load Favorite',
  props<{ userId: number }>()
);
export const loadFavoritesSuccess = createAction(
'[Favorite] Load Favorite Success', props<{favorites: IFavoritesResponse[]}>()
);
export const loadFavoritesFailure = createAction(
'[Favorite] Load Favorite Failure',props<{ error: string }>()
);
export const addFavorite = createAction('[Favorite] Add Favorite', props<{favorite: any}>());
export const removeFavorite = createAction('[Favorite] Remove Favorite', props<{postId: number}>());
export const addRemoveOperationStatus = createAction('[Favorite] Operation Status', props<{status: boolean}>());
