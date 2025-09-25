import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="teacher-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <button class="hamburger-menu" (click)="toggleSidebar()">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <img src="/favicon.ico" alt="School Logo" class="logo">
          <div class="school-info">
            <h1>Teacher Portal</h1>
            <p>Academic Management System</p>
          </div>
        </div>
        <div class="header-right">
          <div class="teacher-info">
            <span class="teacher-name">{{ teacherName }}</span>
            <span class="teacher-role">{{ teacherSubject }}</span>
          </div>
          <div class="header-actions">
            <button class="notification-btn" title="Notifications">
              🔔
              <span class="notification-badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
            </button>
            <button class="profile-btn" (click)="openProfile()" title="Profile">
              👨‍🏫
            </button>
            <button class="logout-btn" (click)="logout()" title="Logout">
              🚪
            </button>
          </div>
        </div>
      </header>

      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <nav class="sidebar-nav">
          <ul>
            <!-- Core V1 Features Only -->
            <li class="nav-item" [class.active]="currentRoute === 'overview'">
              <button type="button" (click)="navigateTo('overview')" class="nav-button" 
                      [title]="sidebarCollapsed ? 'Overview' : ''">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Overview</span>
              </button>
            </li>
            <li class="nav-item" [class.active]="currentRoute === 'my-classes'">
              <button type="button" (click)="navigateTo('my-classes')" class="nav-button"
                      [title]="sidebarCollapsed ? 'My Classes' : ''">
                <span class="nav-icon">🏫</span>
                <span class="nav-text">My Classes</span>
              </button>
            </li>
            <li class="nav-item" [class.active]="currentRoute === 'attendance'">
              <button type="button" (click)="navigateTo('attendance')" class="nav-button"
                      [title]="sidebarCollapsed ? 'Attendance' : ''">
                <span class="nav-icon">✅</span>
                <span class="nav-text">Attendance</span>
              </button>
            </li>
            <li class="nav-item" [class.active]="currentRoute === 'homework'">
              <button type="button" (click)="navigateTo('homework')" class="nav-button"
                      [title]="sidebarCollapsed ? 'Homework' : ''">
                <span class="nav-icon">📚</span>
                <span class="nav-text">Homework</span>
              </button>
            </li>
            <li class="nav-item" [class.active]="currentRoute === 'student-progress'">
              <button type="button" (click)="navigateTo('student-progress')" class="nav-button"
                      [title]="sidebarCollapsed ? 'Progress' : ''">
                <span class="nav-icon">📈</span>
                <span class="nav-text">Progress</span>
              </button>
            </li>
            <li class="nav-item" [class.active]="currentRoute === 'profile'">
              <button type="button" (click)="navigateTo('profile')" class="nav-button"
                      [title]="sidebarCollapsed ? 'Profile' : ''">
                <span class="nav-icon">👨‍🏫</span>
                <span class="nav-text">Profile</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content" [class.sidebar-collapsed]="sidebarCollapsed">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .teacher-dashboard {
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: "Inter", sans-serif;
      background: #f8fafc;
    }

    /* Header Styles */
    .dashboard-header {
      background: linear-gradient(
        135deg,
        #1e293b 0%,
        #334155 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 70px;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        padding: 0.5rem 1rem;
      }
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .hamburger-menu {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px;
      border-radius: 6px;
      transition: background-color 0.3s ease;
    }

    .hamburger-menu:hover {
      background: rgba(255,255,255,0.1);
    }

    .hamburger-menu span {
      width: 20px;
      height: 2px;
      background: white;
      transition: all 0.3s ease;
    }

    .logo {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }

    .school-info h1 {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: #f8fafc;
    }

    .school-info p {
      font-size: 0.8rem;
      margin: 0;
      color: #cbd5e1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .teacher-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .teacher-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .teacher-role {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .header-actions button {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .header-actions button:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Sidebar Styles */
    .sidebar {
      position: fixed;
      left: 0;
      top: 70px;
      width: 250px;
      height: calc(100vh - 70px);
      background: white;
      border-right: 1px solid #e2e8f0;
      transition: width 0.3s ease;
      z-index: 999;
      overflow-y: auto;
    }

    .sidebar.collapsed {
      width: 60px;
    }

    .sidebar.collapsed .nav-text {
      opacity: 0;
      width: 0;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .sidebar.collapsed .nav-button {
      justify-content: center;
      padding: 0.75rem 0;
    }

    .sidebar.collapsed .nav-icon {
      margin: 0;
    }

    .sidebar-nav ul {
      list-style: none;
      padding: 1rem 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 0.25rem;
    }

    .nav-item a,
    .nav-item .nav-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #64748b;
      text-decoration: none;
      transition: all 0.3s ease;
      border-right: 3px solid transparent;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .nav-item a:hover,
    .nav-item .nav-button:hover {
      background: #f1f5f9;
      color: #1e293b;
      border-right-color: #3b82f6;
    }

    .nav-item.active a,
    .nav-item.active .nav-button {
      background: #eff6ff;
      color: #1e40af;
      border-right-color: #3b82f6;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
    }

    .nav-text {
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Main Content */
    .main-content {
      margin-left: 250px;
      margin-top: 70px;
      padding: 2rem;
      transition: margin-left 0.3s ease;
      min-height: calc(100vh - 70px);
    }

    .main-content.sidebar-collapsed {
      margin-left: 60px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar.collapsed {
        transform: translateX(-100%);
      }

      .sidebar:not(.collapsed) {
        transform: translateX(0);
      }

      .main-content {
        margin-left: 0;
      }

      .main-content.sidebar-collapsed {
        margin-left: 0;
      }

      .teacher-info {
        display: none;
      }

      .header-actions {
        flex-direction: column;
        gap: 0.5rem;
      }

      .assignment-info {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  currentRoute = '';
  teacherName = 'Mr. Rajesh Kumar';
  teacherSubject = 'Mathematics Teacher';
  notificationCount = 3;
  
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    // Track route changes to highlight active menu
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = this.extractRouteFromUrl(event.urlAfterRedirects);
    });

    // Set initial route
    this.currentRoute = this.extractRouteFromUrl(this.router.url);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private extractRouteFromUrl(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1] || '';
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  navigateTo(route: string) {
    this.router.navigate(['/teacher-dashboard', route]);
  }

  openProfile() {
    this.router.navigate(['/teacher-dashboard/profile']);
  }

  logout() {
    // Add logout logic here
    console.log('Logging out...');
    this.router.navigate(['/teacher-login']);
  }
}