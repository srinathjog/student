import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap, EMPTY } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login$ = createEffect(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.http.post<any>(`${environment.apiBaseUrl}/parent-login`, { username, password }).pipe(
          map((response) => AuthActions.loginSuccess({ token: response.token, user: response.child })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    );
  });

  loginSuccess$ = createEffect(
    () => {
      if (!isPlatformBrowser(this.platformId)) {
        return EMPTY;
      }
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, user }) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('parentToken', token);
            localStorage.setItem('child', JSON.stringify(user));
            this.router.navigate(['/parent-dashboard']);
          }
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      if (!isPlatformBrowser(this.platformId)) {
        return EMPTY;
      }
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('parentToken');
            localStorage.removeItem('child');
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );
}
