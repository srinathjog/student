import { provideStore } from '@ngrx/store';
import { reducers } from './store';

// No effects - using services instead for better SSR compatibility
export const ngrxProviders = [
  provideStore(reducers)
];
