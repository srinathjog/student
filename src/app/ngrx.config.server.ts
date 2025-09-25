import { provideStore } from '@ngrx/store';
import { reducers } from './store';

// No effects provided on the server to avoid SSR issues
export const ngrxProvidersServer = [
  provideStore(reducers)
];
