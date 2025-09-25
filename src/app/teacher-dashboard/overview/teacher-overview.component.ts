import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface QuickStat {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  route?: string;
}

interface TodayClass {
  time: string;
  class: string;
  subject: string;
  room: string;
}

interface RecentActivity {
  title: string;
  description: string;
  time: string;
  type: 'homework' | 'attendance' | 'progress' | 'general';
}

@Component({
  selector: 'app-teacher-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="overview-container">
      <div class="page-header">
        <h1>🏫 Teacher Dashboard</h1>
        <p>Welcome back, Mrs. Sharma! Here's your daily overview for {{ getCurrentDate() }}</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div *ngFor="let stat of quickStats" 
             class="stat-card" 
             [ngClass]="stat.color"
             [routerLink]="stat.route"
             [style.cursor]="stat.route ? 'pointer' : 'default'">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Today's Classes -->
        <div class="card schedule-card">
          <div class="card-header">
            <h2>📅 Today's Schedule</h2>
            <span class="class-count">{{ todayClasses.length }} classes</span>
          </div>
          <div class="schedule-list">
            <div *ngFor="let class of todayClasses" class="schedule-item">
              <div class="schedule-time">{{ class.time }}</div>
              <div class="schedule-details">
                <div class="schedule-class">{{ class.class }}</div>
                <div class="schedule-subject">{{ class.subject }} • Room {{ class.room }}</div>
              </div>
              <div class="schedule-status">
                <span class="status-badge upcoming">Upcoming</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card actions-card">
          <div class="card-header">
            <h2>⚡ Quick Actions</h2>
            <span class="subtitle">Common tasks</span>
          </div>
          <div class="actions-grid">
            <button class="action-btn attendance" routerLink="/teacher-dashboard/attendance">
              <div class="action-icon">📊</div>
              <div class="action-text">
                <div class="action-title">Mark Attendance</div>
                <div class="action-desc">Today's classes</div>
              </div>
            </button>
            
            <button class="action-btn homework" routerLink="/teacher-dashboard/homework">
              <div class="action-icon">📝</div>
              <div class="action-text">
                <div class="action-title">Assign Homework</div>
                <div class="action-desc">Create assignments</div>
              </div>
            </button>
            
            <button class="action-btn progress" routerLink="/teacher-dashboard/student-progress">
              <div class="action-icon">📈</div>
              <div class="action-text">
                <div class="action-title">Student Progress</div>
                <div class="action-desc">Track performance</div>
              </div>
            </button>
            
            <button class="action-btn classes" routerLink="/teacher-dashboard/my-classes">
              <div class="action-icon">🏫</div>
              <div class="action-text">
                <div class="action-title">My Classes</div>
                <div class="action-desc">View all classes</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="card activity-card">
          <div class="card-header">
            <h2>🔔 Recent Activities</h2>
            <span class="subtitle">Last 7 days</span>
          </div>
          <div class="activity-list">
            <div *ngFor="let activity of recentActivities" class="activity-item">
              <div class="activity-icon" [ngClass]="activity.type">
                {{ getActivityIcon(activity.type) }}
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-desc">{{ activity.description }}</div>
              </div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>

        <!-- Pending Tasks -->
        <div class="card tasks-card">
          <div class="card-header">
            <h2>✅ Pending Tasks</h2>
            <span class="task-count">{{ getPendingCount() }} pending</span>
          </div>
          <div class="tasks-list">
            <div class="task-item">
              <div class="task-checkbox">📝</div>
              <div class="task-content">
                <div class="task-title">Review homework submissions</div>
                <div class="task-desc">Class 10A Mathematics - 15 submissions</div>
              </div>
              <div class="task-due">Due today</div>
            </div>
            
            <div class="task-item">
              <div class="task-checkbox">📊</div>
              <div class="task-content">
                <div class="task-title">Prepare monthly attendance report</div>
                <div class="task-desc">All classes for January 2024</div>
              </div>
              <div class="task-due">2 days left</div>
            </div>
            
            <div class="task-item">
              <div class="task-checkbox">📈</div>
              <div class="task-content">
                <div class="task-title">Update student progress reports</div>
                <div class="task-desc">Mid-term evaluations for Class 10B</div>
              </div>
              <div class="task-due">1 week left</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: #64748b;
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
      border-left: 4px solid;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .stat-card.blue { border-left-color: #3b82f6; }
    .stat-card.green { border-left-color: #10b981; }
    .stat-card.orange { border-left-color: #f59e0b; }
    .stat-card.purple { border-left-color: #8b5cf6; }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-header h2 {
      color: #1e293b;
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }

    .class-count, .subtitle, .task-count {
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Schedule */
    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .schedule-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 3px solid #3b82f6;
    }

    .schedule-time {
      font-weight: 600;
      color: #1e293b;
      min-width: 60px;
    }

    .schedule-details {
      flex: 1;
    }

    .schedule-class {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .schedule-subject {
      color: #64748b;
      font-size: 0.8rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-badge.upcoming {
      background: #dbeafe;
      color: #1d4ed8;
    }

    /* Quick Actions */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .action-desc {
      color: #64748b;
      font-size: 0.8rem;
    }

    /* Activities */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: #f8fafc;
    }

    .activity-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .activity-icon.homework { background: #fef3c7; }
    .activity-icon.attendance { background: #dcfce7; }
    .activity-icon.progress { background: #dbeafe; }
    .activity-icon.general { background: #f3e8ff; }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .activity-desc {
      color: #64748b;
      font-size: 0.8rem;
    }

    .activity-time {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 500;
    }

    /* Tasks */
    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 3px solid #f59e0b;
    }

    .task-checkbox {
      font-size: 1.2rem;
    }

    .task-content {
      flex: 1;
    }

    .task-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .task-desc {
      color: #64748b;
      font-size: 0.8rem;
    }

    .task-due {
      color: #dc2626;
      font-size: 0.8rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .overview-container {
        padding: 1rem;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class TeacherOverviewComponent {
  quickStats: QuickStat[] = [
    {
      title: 'My Classes',
      value: 3,
      icon: '🏫',
      color: 'blue',
      route: '/teacher-dashboard/my-classes'
    },
    {
      title: 'Students',
      value: 95,
      icon: '👥',
      color: 'green',
      route: '/teacher-dashboard/student-progress'
    },
    {
      title: 'Pending Homework',
      value: 12,
      icon: '📝',
      color: 'orange',
      route: '/teacher-dashboard/homework'
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      icon: '📊',
      color: 'purple',
      route: '/teacher-dashboard/attendance'
    }
  ];

  todayClasses: TodayClass[] = [
    {
      time: '9:00 AM',
      class: 'Class 10A',
      subject: 'Mathematics',
      room: '201'
    },
    {
      time: '11:00 AM',
      class: 'Class 10B',
      subject: 'Science',
      room: '105'
    },
    {
      time: '2:00 PM',
      class: 'Class 10C',
      subject: 'English',
      room: '303'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      title: 'Homework Assigned',
      description: 'Algebra practice problems for Class 10A',
      time: '2 hours ago',
      type: 'homework'
    },
    {
      title: 'Attendance Marked',
      description: 'Class 10B Science - 30/32 students present',
      time: '1 day ago',
      type: 'attendance'
    },
    {
      title: 'Progress Updated',
      description: 'Monthly evaluation scores for Class 10C',
      time: '2 days ago',
      type: 'progress'
    },
    {
      title: 'Parent Meeting',
      description: 'Discussed Aarav Sharma\'s performance',
      time: '3 days ago',
      type: 'general'
    }
  ];

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getActivityIcon(type: string): string {
    const icons: {[key: string]: string} = {
      homework: '📝',
      attendance: '📊',
      progress: '📈',
      general: '📋'
    };
    return icons[type] || '📋';
  }

  getPendingCount(): number {
    return 3; // Simple static count for V1
  }
}