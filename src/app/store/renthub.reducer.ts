import { createReducer, on } from '@ngrx/store';
import {
  addFavorite,
  addRemoveOperationStatus,
  createNewPost,
  createPostFailure,
  createPostSuccess,
  loadFavorites,
  loadFavoritesSuccess,
  loadFeaturedPosts,
  loadFeaturedPostsSuccess,
  loadPosts,
  loadPostsByUserId,
  loadPostsByUserIdSuccess,
  loadPostSuccess,
  removeFavorite,
  resetAddRemoveOperationStatus,
  updateExistingPost,
  updateExistingPostSuccess,
} from './renthub.action';
import { IPostResponse } from '../models/post.vm';
import { IFavoritesResponse } from '../models/favorites.vm';

/** State interface of  Post */
export interface RentHubState {
  posts: IPostResponse[];
  featuredPosts: IPostResponse[];
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
  featuredPosts: [],
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
  on(loadFeaturedPosts, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(loadFeaturedPostsSuccess, (state, { featuredPosts }) => ({
    ...state,
    isLoading: true,
    featuredPosts: featuredPosts.filter((post) => post.featured)
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
  on(createNewPost, (state) => ({
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
  })),
  on(resetAddRemoveOperationStatus, (state) => ({
    ...state,
    favoriteOperationStatus: false,
  }))
);
