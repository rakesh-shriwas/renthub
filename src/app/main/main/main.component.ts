import { Component, inject, signal } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { IPostResponse } from '../../models/post.vm';
import {
  selectFavorites,
  selectFeaturedPostsState,
  selectLoadFavoritesSuccess,
  selectPosts,
  selectUpdateExistingPostSuccess,
} from '../../store/renthub.selectors';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import {
  addFavorite,
  loadFavorites,
  loadFeaturedPosts,
  loadPosts,
  removeFavorite,
} from '../../store/renthub.action';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { NotRecordFoundComponent } from '../not-record-found/not-record-found.component';
import { AsyncPipe } from '@angular/common';
import { IFavoritesResponse } from '../../models/favorites.vm';

@Component({
  selector: 'app-main',
  imports: [PostCardComponent, NotRecordFoundComponent, AsyncPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private service = inject(CommonService);
  private destroy$ = new Subject<void>();

  loggedInUserDetails = signal<any>(null);
  // myPostList = signal<IPostResponse[]>([]);
  userId: number;
  favoritesList: number[] = [];

  /** Store Post Data */
  posts$: Observable<IPostResponse[]> = this.store.select(selectPosts);
  featuredPostsState$: Observable<IPostResponse[]> = this.store.select(
    selectFeaturedPostsState
  );
  updateExistingPostSuccess$: Observable<any> = this.store.select(
    selectUpdateExistingPostSuccess
  );
  loadFavoritesSuccess$: Observable<any> = this.store.select(
    selectLoadFavoritesSuccess
  );
  favorites$: Observable<IFavoritesResponse[]> =
    this.store.select(selectFavorites);

  ngOnInit(): void {
    this.store.dispatch(loadPosts());
    this.store.dispatch(loadFeaturedPosts());
    this.service
      .getAuthenticateUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.loggedInUserDetails.set(res);
          this.userId = res?.id;
        }
      });
    // this.posts$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
    //   this.myPostList.set([]);
    //   if (res?.length) {
    //     this.myPostList.set(res);
    //   }
    // });
    this.updateExistingPostSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.store.dispatch(loadPosts());
        }
      });

    this.favorites$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.favoritesList = res.map((fav) => fav.postId);
        console.log('favoritesList', this.favoritesList);
      }
    });
    this.store.dispatch(
      loadFavorites({ userId: this.loggedInUserDetails()?.id })
    );

    // this.loadFavoritesSuccess$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     if (res) {
    //       this.store.dispatch(
    //         loadFavorites({ userId: this.loggedInUserDetails()?.id })
    //       );
    //       this.store.dispatch(loadPosts());
    //     }
    //   });
  }

  viewDetails(postId: number): void {
    this.router.navigate(['/app', 'post', postId]);
  }

  editPost(post: IPostResponse): void {
    this.dialog.open(CreatePostDialogComponent, {
      maxWidth: '950px',
      autoFocus: false,
      data: post,
      restoreFocus: false,
    });
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
    return this.favoritesList.includes(postId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
