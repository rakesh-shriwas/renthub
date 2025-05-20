import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CommonService } from '../../services/common.service';
import { Observable, switchMap, tap } from 'rxjs';
import { IFavoritesResponse } from '../../models/favorites.vm';

interface FavoritesInitialState {
  favorites: IFavoritesResponse[];
  isLoading: boolean;
}

@Injectable()
export class FavoritesComponentStore extends ComponentStore<FavoritesInitialState> {
  service = inject(CommonService);

  constructor() {
    super({
      favorites: [],
      isLoading: false,
    });
  }

  /** Favorites Selectors */

  readonly selectFavorites$: Observable<IFavoritesResponse[]> = this.select(
    (state) => state.favorites
  );
  readonly selectIsLoading$: Observable<boolean> = this.select(
    (state) => state.isLoading
  );

  /** Favorites Effects */
  readonly loadFavorites = this.effect(
    (data: Observable<{ userId: number }>) =>
      data.pipe(
        switchMap((req: { userId: number }) => {
          this.setState((state) => ({
            ...state,
            isLoading: true,
          }));
          return this.service.getFavoriteById(req.userId).pipe(
            tap({
              next: (favorites) =>
                this.setState((state) => ({
                  ...state,
                  isLoading: false,
                  favorites,
                })),
              error: () => {
                 this.setState((state) => ({
                  ...state,
                  isLoading: false,
                  favorites: [],
                }));
              },
            })
          );
        })
      )
  );

  /** Favorites Effects */
  // readonly favoriteChange = this.effect(
  //   (trigger$: Observable<{ postId: number, userId: number }>) =>
  //     trigger$.pipe(
  //       switchMap((req: { postId: number, userId: number }) => {
  //         this.setState((state) => ({
  //           ...state,
  //           isLoading: true,
  //         }));
  //         return this.service.favoriteChangesById(req).pipe(
  //           tap({
  //             next: (favorites) =>
  //               this.setState((state) => ({
  //                 ...state,
  //                 isLoading: false,
  //               })),
  //             error: () => {
  //               return this.setState((state) => ({
  //                 ...state,
  //                 isLoading: false,
  //               }));
  //             },
  //           })
  //         );
  //       })
  //     )
  // );
}
