import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ngrxProvidersServer } from './ngrx.config.server';
import { serverRoutes } from './app.routes.server';
import { routes } from './app.routes';

// Server-only configuration - no effects, no client hydration
export const config: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServerRendering(withRoutes(serverRoutes)),
    ...ngrxProvidersServer, // Only store, no effects
  ]
};
