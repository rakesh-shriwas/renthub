import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { IPostResponse } from '../../models/post.vm';
import { selectFavorites, selectOperationStatus, selectPosts } from '../../store/renthub.selectors';
import { IFavoritesResponse } from '../../models/favorites.vm';
import {
  addFavorite,
  loadFavorites,
  loadPosts,
  removeFavorite,
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
  loggedInUser = signal<any>(null);

  favoritesPostList = signal<IPostResponse[]>([]);

  posts$: Observable<IPostResponse[]> = this.store.select(selectPosts);
  operationStatus$: Observable<boolean> = this.store.select(selectOperationStatus);
  favorites$: Observable<IFavoritesResponse[]> =
    this.store.select(selectFavorites);

  ngOnInit(): void {
    this.store.dispatch(loadPosts());
    this.service.getAuthenticateUser().subscribe((res) => {
      if (res) {
        this.loggedInUser.set(res);
        // this.componentStore.loadFavorites({ userId: res?.id });
        this.store.dispatch(loadFavorites({ userId: res?.id }));
      }
    });
    combineLatest([this.favorites$, this.posts$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([favorites, posts]) => {
        if (favorites?.length && posts?.length) {
          console.log('posts', posts);
          // Step 1: Extract favorite post IDs
          const favoritePostIds = new Set(favorites.map((f) => f.postId));
          console.log('favoritePostIds', favoritePostIds);
          // Step 2: Filter posts based on those favorite IDs
          const filterData = posts.filter((post) =>
            favoritePostIds.has(+post.id)
          );
          // Step 3: Add isFavorite key to each filtered item
          const favoritePostData = filterData.map((data) => ({
            ...data,
            isFavorite: favoritePostIds.has(data.id),
          }));
          this.favoritesPostList.set(favoritePostData);
          console.log('this.favoritesPostList', this.favoritesPostList());
        }
      });
      this.operationStatus$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.store.dispatch(loadPosts());
        this.store.dispatch(loadFavorites({ userId: this.loggedInUser()?.id }));
      });
  }

  viewDetails(id: Event): void {
    this.router.navigate(['/app', 'my', 'post', id]);
  }

  onFavoriteChange(postId: any): void {
    this.store
      .select(selectFavorites)
      .pipe(take(1))
      .subscribe((favorites) => {
        const isFav = favorites.some((fav) => fav.postId === postId);

        if (isFav) {
          this.store.dispatch(removeFavorite({ postId }));
        } else {
          this.store.dispatch(
            addFavorite({
              favorite: { postId, userId: this.loggedInUser()?.id },
            })
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
