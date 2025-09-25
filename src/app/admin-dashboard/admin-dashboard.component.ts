import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  showDropdown = false;

  adminUsername = 'Admin';

  constructor(private authService: AuthService, public router: Router) {
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    if (isBrowser) {
      const stored = localStorage.getItem('adminUsername');
      if (stored) this.adminUsername = stored;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}
