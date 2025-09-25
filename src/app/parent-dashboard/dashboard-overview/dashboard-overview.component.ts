import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { StudentInfoComponent } from '../student-info/student-info.component';
import { EventsComponent } from '../events/events.component';
import { environment } from '../../environments/environment';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, StudentInfoComponent, EventsComponent],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
      <p class="text-lg mb-6">Welcome, Parent! Here is your child's info:</p>
      @if (showDashboard) {
        <div class="parent-dashboard-flex">
          @if (students.length > 0) {
            @for (student of students; track student._id) {
              <div class="student-events-row">
                <div class="student-info-col">
                  <app-student-info [student]="student"></app-student-info>
                </div>
                <div class="events-calendar-col">
                  <app-events [className]="student.class"></app-events>
                </div>
              </div>
            }
          } @else {
            <p>No student details found.</p>
          }
        </div>
      }
    </div>
  `,
  styleUrls: ['../parent-dashboard.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  students: any[] = [];
  showDashboard = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('parentToken');
    if (token) {
      const parentId = this.getParentIdFromToken(token);
      if (parentId) {
        this.fetchStudentInfo(parentId);
      }
    }
  }

  getParentIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null;
    } catch (e) {
      return null;
    }
  }

  fetchStudentInfo(parentId: string) {
    this.http.get<any>(`${environment.apiBaseUrl}/parent-students/${parentId}`).subscribe(
      (data) => {
        console.log('Parent students API response:', data);
        if (Array.isArray(data)) {
          this.students = data;
        } else if (data && Array.isArray(data.students)) {
          this.students = data.students;
        } else if (data) {
          this.students = [data];
        } else {
          this.students = [];
        }
        this.showDashboard = true;
        this.cdr.detectChanges();
      },
      (error) => {
        this.students = [];
        this.showDashboard = false;
        this.cdr.detectChanges();
      }
    );
  }
}