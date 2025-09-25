import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(success => {
      console.log('Login API result:', success);
      if (success) {
        this.error = '';
        console.log('Navigating to /admin');
        this.router.navigate(['/admin']);
      } else {
        this.error = 'Invalid credentials';
        console.log('Login failed, staying on admin-login');
      }
    });
  }
}