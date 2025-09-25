import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">👨‍🏫</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Teacher Portal</h1>
          <p class="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div class="flex items-center">
            <span class="text-red-500 mr-2">⚠️</span>
            {{ error }}
          </div>
        </div>

        <!-- Success Message -->
        <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <div class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            {{ success }}
          </div>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="space-y-6">
            <!-- Username/Email Field -->
            <div>
              <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                [(ngModel)]="username"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter your username or email"
                [disabled]="loading">
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors pr-12"
                  placeholder="Enter your password"
                  [disabled]="loading">
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  [disabled]="loading">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              [disabled]="loading || !loginForm.form.valid"
              class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              
              <span *ngIf="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
              
              <span *ngIf="!loading">
                Sign In to Dashboard
              </span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-gray-600 text-sm">
            Having trouble? Contact 
            <a href="mailto:admin@greenwood.edu" class="text-purple-600 hover:text-purple-700">
              IT Support
            </a>
          </p>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <button
              (click)="goBack()"
              class="text-purple-600 hover:text-purple-700 text-sm font-medium">
              ← Back to Main Page
            </button>
          </div>
        </div>

        <!-- Demo Credentials (Remove in production) -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
          <div class="text-xs text-blue-700 space-y-1">
            <p><strong>Username:</strong> rajesh.kumar</p>
            <p><strong>Password:</strong> teacher123</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient-to-br {
      background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
    }
    
    /* Custom animations */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class TeacherLoginComponent {
  username = '';
  password = '';
  error = '';
  success = '';
  loading = false;
  showPassword = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  login() {
    // Clear previous messages
    this.error = '';
    this.success = '';
    
    // Validate inputs
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.loading = true;

    // Use AuthService with secure password hashing
    this.authService.teacherLogin(this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response && response.token) {
          this.success = 'Login successful! Redirecting to dashboard...';
          
          // AuthService handles navigation and token storage automatically
          setTimeout(() => {
            // Fallback navigation if needed
            this.router.navigate(['/teacher-dashboard']);
          }, 1500);
          
        } else {
          this.error = response?.message || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Teacher login error:', error);
        
        if (error.status === 401) {
          this.error = 'Invalid username or password';
        } else if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = 'Network error. Please check your connection.';
        }
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigate(['/']);
  }

  // Quick fill demo credentials (for testing)
  fillDemoCredentials() {
    this.username = 'rajesh.kumar';
    this.password = 'teacher123';
  }
}