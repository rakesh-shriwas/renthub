import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { IPostResponse } from '../../models/post.vm';
import {
  selectFavorites,
  selectOperationStatus,
  selectPosts,
} from '../../store/renthub.selectors';
import { IFavoritesResponse } from '../../models/favorites.vm';
import {
  addFavorite,
  loadFavorites,
  loadPosts,
  removeFavorite,
  resetAddRemoveOperationStatus,
} from '../../store/renthub.action';
import { PostCardComponent } from '../post-card/post-card.component';
import { NotRecordFoundComponent } from '../not-record-found/not-record-found.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-favorites',
  imports: [PostCardComponent, NotRecordFoundComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store);
  private service = inject(CommonService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  loggedInUserDetails = signal<any>(null);

  favoritesPostList = signal<IPostResponse[]>([]);
  favPostIds: number[] = [];

  posts$: Observable<IPostResponse[]> = this.store.select(selectPosts);
  operationStatus$: Observable<boolean> = this.store.select(
    selectOperationStatus
  );
  favorites$: Observable<IFavoritesResponse[]> =
    this.store.select(selectFavorites);

  ngOnInit(): void {
    this.store.dispatch(loadPosts());

    combineLatest([this.favorites$, this.posts$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([favorites, posts]) => {
        if (favorites?.length && posts?.length) {
          // Step 1: Extract favorite post IDs
          const favoritePostIds = new Set(favorites.map((f) => f.postId));
          // Step 2: Filter posts based on those favorite IDs
          const filterData = posts.filter((post) =>
            favoritePostIds.has(+post.id)
          );
          // // Step 3: Add isFavorite key to each filtered item
          // const favoritePostData = filterData.map((data) => ({
          //   ...data,
          //   isFavorite: favoritePostIds.has(data.id),
          // }));
          this.favoritesPostList.set(filterData);
          this.favPostIds = favorites.map((fav) => fav.postId);
        }
      });
    this.operationStatus$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.store.dispatch(resetAddRemoveOperationStatus());
        this.store.dispatch(loadPosts());
        this.store.dispatch(
          loadFavorites({ userId: this.loggedInUserDetails()?.id })
        );
      }
    });
    this.service.getAuthenticateUser().subscribe((res) => {
      if (res) {
        this.loggedInUserDetails.set(res);
        // this.componentStore.loadFavorites({ userId: res?.id });
        this.store.dispatch(loadFavorites({ userId: res?.id }));
      }
    });
  }

  viewDetails(id: Event): void {
    this.router.navigate(['/app', 'my', 'post', id]);
  }

  onFavoriteChange(postId: any): void {
    this.service
      .findFavorite(postId, this.loggedInUserDetails()?.id)
      .subscribe((favorites) => {
        if (favorites.length > 0) {
          const favorite = favorites[0];
          this.store.dispatch(removeFavorite({ postId: favorite.id }));
        } else {
          this.store.dispatch(
            addFavorite({
              favorite: { postId, userId: this.loggedInUserDetails()?.id },
            })
          );
        }
      });
  }

  isFavorite(postId: number): boolean {
    return this.favPostIds.includes(postId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
