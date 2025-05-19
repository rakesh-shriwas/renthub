import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RentHubState } from "./renthub.reducer";

export const selectRentPostState = createFeatureSelector<RentHubState>('posts');

export const selectPosts = createSelector(selectRentPostState, state => state.posts);
export const selectIsLoading = createSelector(selectRentPostState, state => state.isLoading);
export const selectCreatePostSuccess = createSelector(selectRentPostState, state => state.createPostSuccess);

/** Comments Selectors */
// export const selectCommentsState = createFeatureSelector<RentHubState>('comments');

// export const selectComments = createSelector(selectCommentsState, state => state.comments);
// export const selectIsLoadingComments = createSelector(selectCommentsState, state => state.isLoading);
// export const selectErrorComments = createSelector(selectCommentsState, state => state.error);
