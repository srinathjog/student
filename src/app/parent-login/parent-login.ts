import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store';
import { AuthService } from '../services/auth.service';
import { selectAuthError, selectAuthLoading } from '../store/auth/auth.selectors';

@Component({
  selector: 'app-parent-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parent-login.html',
  styleUrls: ['./parent-login.scss']
})
export class ParentLoginComponent {
  username = '';
  password = '';
  error$: Observable<any>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.error$ = this.store.select(selectAuthError);
    this.loading$ = this.store.select(selectAuthLoading);
  }

  login() {
    // Use service instead of dispatching action directly
    this.authService.parentLogin(this.username, this.password).subscribe();
  }
}
