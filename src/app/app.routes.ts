import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./landing-page/landing-page.routes').then((r) => r.routes),
  },

  {
    path: 'app',
    loadComponent: () =>
      import('./main/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./main/main/main.component').then((m) => m.MainComponent),
      },
      {
        path: 'my/posts',
        loadComponent: () =>
          import('./main/myposts/myposts.component').then(
            (m) => m.MypostsComponent
          ),
      },

      {
        path: 'post/:id',
        loadComponent: () =>
          import('./main/post-details/post-details.component').then(
            (m) => m.PostDetailsComponent
          ),
      },
      {
        path: 'my/post/:id',
        loadComponent: () =>
          import('./main/post-details/post-details.component').then(
            (m) => m.PostDetailsComponent
          ),
      },
      {
        path: 'my/fav',
        loadComponent: () =>
          import('./main/favorites/favorites.component').then(
            (m) => m.FavoritesComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
