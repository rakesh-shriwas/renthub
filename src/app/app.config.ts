import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { postReducer } from './store/renthub.reducer';
import { PostEffects } from './store/renthub.effects';
import { env } from '../environments/environment';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideStore({ renthub: postReducer }),
    provideEffects([PostEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: env.production }),
  ],
};

