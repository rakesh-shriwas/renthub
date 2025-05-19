import { Component, inject, OnInit, signal } from '@angular/core';
import { FavoritesComponentStore } from './favorites.store';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { Router } from '@angular/router';
import { IPostResponse } from '../../models/post.vm';
import { selectPosts } from '../../store/renthub.selectors';
import { IFavoritesResponse } from '../../models/favorites.vm';
import { loadPosts } from '../../store/renthub.action';
import { PostCardComponent } from '../post-card/post-card.component';
import { NotRecordFoundComponent } from '../not-record-found/not-record-found.component';
import { CommonService } from '../../services/common.service';
import { IUser } from '../../models/user.vm';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-favorites',
  imports: [PostCardComponent, NotRecordFoundComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  providers: [FavoritesComponentStore,AsyncPipe],
})
export class FavoritesComponent implements OnInit {
  private componentStore = inject(FavoritesComponentStore);
  private store = inject(Store);
  private service = inject(CommonService);
  loggedInUser = signal<any>(null);

  private destroy$ = new Subject<void>();
  router = inject(Router);

  favoritesPostList = signal<IPostResponse[]>([]);

  posts$: Observable<IPostResponse[]> = this.store.select(selectPosts);

  favorites$: Observable<IFavoritesResponse[]> =
    this.componentStore.selectFavorites$;
  isLoading$: Observable<boolean> = this.componentStore.selectIsLoading$;

  ngOnInit(): void {
    this.store.dispatch(loadPosts());
    this.service.getAuthenticateUser().subscribe((res) => {
      if (res) {
        this.loggedInUser.set(res);
        this.componentStore.loadFavorites({ userId: res?.id });
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
        }
      });
  }

  viewDetails(id: Event): void {
    this.router.navigate(['/app', 'my', 'post', id]);
  }

  onFavoriteChange(postId: number): void {
    console.log('Fav::', event);
    // this.componentStore.favoriteChange({postId, userId: 1})
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
