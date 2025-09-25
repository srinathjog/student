import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4">
        <h2 class="text-2xl font-bold mb-6 text-center">Welcome! Please select login type:</h2>
        <button (click)="goToLogin('admin')" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Admin Login</button>
        <button (click)="goToLogin('teacher')" class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Teacher Login</button>
        <button (click)="goToLogin('parent')" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Parent Login</button>
      </div>
    </div>
  `
})
export class LandingComponent {
  constructor(public router: Router) {}
  goToLogin(type: 'admin' | 'parent' | 'teacher') {
    this.router.navigate([type + '-login']);
  }
}
