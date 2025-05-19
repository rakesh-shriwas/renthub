import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full' },
  {
    path: 'public',
    loadComponent: () =>
      import('./landing-page.component').then((m) => m.LandingPageComponent),
    children: [
      {
        path: '',
        redirectTo: 'post',
        pathMatch: 'full',
      },
      {
        path: 'post',
        loadComponent: () =>
          import('./public-post/public-post.component').then(
            (m) => m.PublicPostComponent
          ),
      },
      {
        path: 'post/:id',
        loadComponent: () =>
          import('../main/post-details/post-details.component').then(
            (m) => m.PostDetailsComponent
          ),
      },
    ],
  },
];
