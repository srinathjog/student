import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as AuthActions from '../store/auth/auth.actions';
import { CryptoService } from './crypto.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private store: Store,
    private cryptoService: CryptoService
  ) {}

  // Admin login with secure password hashing
  login(username: string, password: string): Observable<boolean> {
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    const hashedPassword = this.cryptoService.hashPassword(password);
    return this.http.post<{ message?: string, token?: string }>(`${environment.apiBaseUrl}/admin-login`, { username, password: hashedPassword })
      .pipe(
        map(res => {
          if (res.message === 'Login successful' && res.token && isBrowser) {
            localStorage.setItem('adminToken', res.token);
            localStorage.setItem('adminUsername', username);
            this.loggedIn = true;
            return true;
          } else {
            this.loggedIn = false;
            return false;
          }
        }),
        catchError(() => {
          this.loggedIn = false;
          return of(false);
        })
      );
  }

  // Parent login with secure password hashing
  parentLogin(username: string, password: string): Observable<any> {
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    const hashedPassword = this.cryptoService.hashPassword(password);
    return this.http.post<any>(`${environment.apiBaseUrl}/parent-login`, { username, password: hashedPassword })
      .pipe(
        tap(response => {
          if (response.token && isBrowser) {
            // Dispatch success action to store
            this.store.dispatch(AuthActions.loginSuccess({ token: response.token, user: response.child }));
            // Handle side effects
            localStorage.setItem('parentToken', response.token);
            localStorage.setItem('child', JSON.stringify(response.child));
            this.router.navigate(['/parent-dashboard']);
          }
        }),
        catchError(error => {
          // Dispatch failure action
          this.store.dispatch(AuthActions.loginFailure({ error }));
          return of(null);
        })
      );
  }

  // Teacher login with secure password hashing
  teacherLogin(username: string, password: string): Observable<any> {
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    const hashedPassword = this.cryptoService.hashPassword(password);
    return this.http.post<any>(`${environment.apiBaseUrl}/teacher/teacher-login`, { username, password: hashedPassword })
      .pipe(
        tap(response => {
          if (response.token && isBrowser) {
            // Store teacher authentication data
            localStorage.setItem('teacherToken', response.token);
            localStorage.setItem('teacher', JSON.stringify(response.teacher));
            this.loggedIn = true;
            this.router.navigate(['/teacher-dashboard']);
          }
        }),
        catchError(error => {
          console.error('Teacher login error:', error);
          return of(null);
        })
      );
  }

  logout(): void {
    this.loggedIn = false;
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    if (isBrowser) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('parentToken');
      localStorage.removeItem('child');
      localStorage.removeItem('teacherToken');
      localStorage.removeItem('teacher');
      this.store.dispatch(AuthActions.logout());
      this.router.navigate(['/']);
    }
  }

  isAuthenticated(): boolean {
    // Check for valid adminToken in localStorage
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    if (!isBrowser) return false;
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && Date.now() < payload.exp * 1000) {
          return true;
        } else {
          // Token expired
          localStorage.removeItem('adminToken');
        }
      } catch (e) {
        // Invalid token, clear it
        localStorage.removeItem('adminToken');
      }
    }
    return false;
  }
}
