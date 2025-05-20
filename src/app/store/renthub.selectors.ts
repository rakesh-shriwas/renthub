import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RentHubState } from './renthub.reducer';

export const selectRentPostState =
  createFeatureSelector<RentHubState>('renthub');

export const selectPosts = createSelector(
  selectRentPostState,
  (state) => state.posts
);
export const selectIsLoading = createSelector(
  selectRentPostState,
  (state) => state.isLoading
);
export const selectCreatePostSuccess = createSelector(
  selectRentPostState,
  (state) => state.createPostSuccess
);
export const selectUpdateExistingPostSuccess = createSelector(
  selectRentPostState,
  (state) => state.updateExistingPostSuccess
);

/** Favorites */
// export const selectFavoritesState = createFeatureSelector<RentHubState>('favorites');
export const selectFavorites = createSelector(
  selectRentPostState,
  (state) => state.favorites
);
export const selectFavoriteIsLoading = createSelector(
  selectRentPostState,
  (state) => state.favoriteIsLoading
);
export const isPostFavorite = (postId: number) =>
  createSelector(selectFavorites, (favorites) =>
    favorites.some((fav) => fav.postId === postId)
  );

  export const selectOperationStatus = createSelector(selectRentPostState, (state) => state.favoriteOperationStatus)

/** Comments Selectors */
// export const selectCommentsState = createFeatureSelector<RentHubState>('comments');

// export const selectComments = createSelector(selectCommentsState, state => state.comments);
// export const selectIsLoadingComments = createSelector(selectCommentsState, state => state.isLoading);
// export const selectErrorComments = createSelector(selectCommentsState, state => state.error);
