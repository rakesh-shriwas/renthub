import { createAction, props } from '@ngrx/store';
import { IPostRequest, IPostResponse } from '../models/post.vm';

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
