import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './auth/auth.reducer';

// Define the shape of your root state
export interface AppState {
  auth: AuthState;
  students: any;
}

// Root reducers placeholder
export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  students: (state = [], action) => state,
};
