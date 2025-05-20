import { createReducer, on } from '@ngrx/store';
import {
  createPost,
  createPostFailure,
  createPostSuccess,
  loadPosts,
  loadPostSuccess,
  updateExistingPost,
  updateExistingPostSuccess,
} from './renthub.action';
import { IPostResponse } from '../models/post.vm';

/** State interface of  Post */
export interface RentHubState {
  posts: IPostResponse[];
  isLoading: boolean;
  // comments: IComments[];
  error: string | null;
  createPostSuccess: boolean;
  updateExistingPostSuccess: boolean;
}

/** Initial State with default value of  Post */
export const initialState: RentHubState = {
  posts: [],
  isLoading: false,
  // comments: [],
  error: null,
  createPostSuccess: false,
  updateExistingPostSuccess: false,
};

/** Post Reducer Creation */
export const postReducer = createReducer(
  initialState,
  on(loadPosts, (state) => ({
    // Existing state
    ...state,
    isLoading: true,
  })),
  on(loadPostSuccess, (state, { posts }) => ({
    ...state,
    posts,
    isLoading: false,
  })),
  on(createPost, (state) => ({
    ...state,
    isLoading: true,
    createPostSuccess: false,
  })),
  on(createPostSuccess, (state, { post }) => ({
    ...state,
    posts: [...state.posts, post],
    isLoading: false,
    createPostSuccess: true,
  })),
  on(createPostFailure, (state, { error }) => ({
    ...state,
    posts: [],
    isLoading: false,
    error,
  })),
  on(updateExistingPost, (state) => ({
    ...state,
    isLoading: true,
    updateExistingPostSuccess: false,
  })),
  on(updateExistingPostSuccess, (state) => ({
    ...state,
    isLoading: false,
    updateExistingPostSuccess: true,
  }))
);
