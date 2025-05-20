import { createReducer, on } from '@ngrx/store';
import {
  addFavorite,
  addRemoveOperationStatus,
  createPost,
  createPostFailure,
  createPostSuccess,
  loadFavorites,
  loadFavoritesSuccess,
  loadPosts,
  loadPostsByUserId,
  loadPostsByUserIdSuccess,
  loadPostSuccess,
  removeFavorite,
  updateExistingPost,
  updateExistingPostSuccess,
} from './renthub.action';
import { IPostResponse } from '../models/post.vm';
import { IFavoritesResponse } from '../models/favorites.vm';

/** State interface of  Post */
export interface RentHubState {
  posts: IPostResponse[];
  isLoading: boolean;
  // comments: IComments[];
  error: string | null;
  createPostSuccess: boolean;
  updateExistingPostSuccess: boolean;
  favorites: IFavoritesResponse[];
  favoriteIsLoading: boolean;
  favoriteOperationStatus: boolean;
}

/** Initial State with default value of  Post */
export const initialState: RentHubState = {
  posts: [],
  isLoading: false,
  // comments: [],
  error: null,
  createPostSuccess: false,
  updateExistingPostSuccess: false,
  favorites: [],
  favoriteIsLoading: false,
  favoriteOperationStatus: false,
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
  on(loadPostsByUserId, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(loadPostsByUserIdSuccess, (state, { posts }) => ({
    ...state,
    isLoading: false,
    posts,
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
  })),
  on(loadFavorites, (state) => ({
    ...state,
    favoriteIsLoading: true,
  })),
  on(loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favoriteIsLoading: false,
    favorites,
  })),
  on(addFavorite, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite],
  })),
  on(removeFavorite, (state, { postId }) => ({
    ...state,
    favorites: state.favorites.filter((f) => postId !== postId),
  })),
  on(addRemoveOperationStatus, (state, { status }) => ({
    ...state,
    isLoading: false,
    favoriteOperationStatus: status,
  }))
);
