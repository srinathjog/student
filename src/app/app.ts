
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('student');
  constructor(public router: Router) {}

  get showHeader(): boolean {
    return this.router.url !== '/admin-login';
  }
  goToLogin(type: 'admin' | 'parent') {
    if (type === 'admin') {
      this.router.navigate(['/admin-login']);
    } else {
      this.router.navigate(['/parent-login']);
    }
  }
}
