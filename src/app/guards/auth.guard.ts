import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    // Allow if admin is authenticated
    if (this.authService.isAuthenticated()) {
      return true;
    }
    // Allow if parent is authenticated (parentToken in localStorage and not expired)
    if (isBrowser) {
      const token = localStorage.getItem('parentToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp && Date.now() < payload.exp * 1000) {
            return true;
          } else {
            // Token expired
            localStorage.removeItem('parentToken');
            localStorage.removeItem('child');
          }
        } catch (e) {
          // Invalid token, clear it
          localStorage.removeItem('parentToken');
          localStorage.removeItem('child');
        }
      }
    }
    // Redirect to landing page if not authenticated
    this.router.navigate(['/']);
    return false;
  }
}
