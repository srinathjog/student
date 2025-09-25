import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherDashboardService, Student, AttendanceRecord } from '../../services/teacher-dashboard.service';

// Interfaces now imported from service

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="attendance-container">
      <div class="page-header">
        <h1>📊 Attendance Management</h1>
        <p>Mark and track student attendance for your classes</p>
      </div>

      <div class="attendance-stats">
        <div class="stat-card">
          <div class="stat-value">{{ getOverallAttendance() }}%</div>
          <div class="stat-label">Overall Attendance</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTodayPresent() }}</div>
          <div class="stat-label">Present Today</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ attendanceRecords.length }}</div>
          <div class="stat-label">Classes Taken</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getAverageClassSize() }}</div>
          <div class="stat-label">Avg Class Size</div>
        </div>
      </div>

      <div class="attendance-section">
        <div class="section-header">
          <h2>📝 Mark Today's Attendance</h2>
          <div class="class-selector">
            <select [(ngModel)]="selectedClass" (change)="onClassChange()">
              <option value="">Select Class</option>
              <option *ngFor="let className of availableClasses" [value]="className">
                {{ className }}
              </option>
            </select>
            
            <select [(ngModel)]="selectedSection" (change)="onSectionChange()" *ngIf="selectedClass">
              <option value="">Select Section</option>
              <option *ngFor="let section of availableSections" [value]="section">
                Section {{ section }}
              </option>
            </select>
            
            <input type="text" [(ngModel)]="selectedSubject" placeholder="Subject" 
                   class="subject-input" *ngIf="selectedClass && selectedSection">
          </div>
        </div>

        <div class="attendance-form" *ngIf="selectedClass">
          <div class="form-header">
            <div class="class-info">
              <h3>{{ selectedClass }} - {{ getCurrentDate() }}</h3>
              <p>Total Students: {{ students.length }}</p>
              <p *ngIf="selectedSection" class="section-info">Section: {{ selectedSection }}</p>
            </div>
            <div class="quick-actions" *ngIf="students.length > 0">
              <button class="quick-btn present" (click)="markAll('present')">
                ✓ Mark All Present
              </button>
              <button class="quick-btn absent" (click)="markAll('absent')">
                ✗ Mark All Absent
              </button>
            </div>
          </div>
          
          <div class="error-message" *ngIf="errorMessage">
            <p>{{ errorMessage }}</p>
          </div>
          
          <div class="loading-message" *ngIf="isLoading">
            <p>Loading students...</p>
          </div>
          
          <div *ngIf="!selectedSection && selectedClass" class="info-message">
            <p>Please select a section to load students for attendance marking.</p>
          </div>

          <div class="students-grid">
            <div *ngFor="let student of students" class="student-card">
              <div class="student-info">
                <div class="student-name">{{ student.name }}</div>
                <div class="student-roll">Roll: {{ student.rollNumber }}</div>
              </div>
              
              <div class="attendance-buttons">
                <button class="attendance-btn present" 
                        [class.active]="student.status === 'present'"
                        (click)="markAttendance(student, 'present')">
                  ✓ Present
                </button>
                <button class="attendance-btn late"
                        [class.active]="student.status === 'late'"
                        (click)="markAttendance(student, 'late')">
                  ⏰ Late
                </button>
                <button class="attendance-btn absent"
                        [class.active]="student.status === 'absent'"
                        (click)="markAttendance(student, 'absent')">
                  ✗ Absent
                </button>
              </div>
            </div>
          </div>

          <div class="form-footer" *ngIf="hasMarkedAttendance()">
            <div class="attendance-summary">
              <span class="summary-item present">
                Present: {{ getCountByStatus('present') }}
              </span>
              <span class="summary-item late">
                Late: {{ getCountByStatus('late') }}
              </span>
              <span class="summary-item absent">
                Absent: {{ getCountByStatus('absent') }}
              </span>
            </div>
            <button class="save-btn" (click)="saveAttendance()">
              💾 Save Attendance
            </button>
          </div>
        </div>
      </div>

      <div class="attendance-history">
        <h2>📈 Recent Attendance Records</h2>
        <div class="records-grid">
          <div *ngFor="let record of attendanceRecords" class="record-card">
            <div class="record-header">
              <div class="record-info">
                <h3>{{ record.class }} - {{ record.subject }}</h3>
                <p>{{ record.date | date:'fullDate' }}</p>
              </div>
              <div class="attendance-percentage">
                {{ getAttendancePercentage(record) }}%
              </div>
            </div>
            
            <div class="record-stats">
              <div class="stat-item present">
                <span class="count">{{ record.presentCount }}</span>
                <span class="label">Present</span>
              </div>
              <div class="stat-item late">
                <span class="count">{{ record.lateCount }}</span>
                <span class="label">Late</span>
              </div>
              <div class="stat-item absent">
                <span class="count">{{ record.absentCount }}</span>
                <span class="label">Absent</span>
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" 
                   [style.width.%]="getAttendancePercentage(record)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .attendance-container {
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

    .attendance-stats {
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
      text-align: center;
      border-left: 4px solid #10b981;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .attendance-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      color: #1e293b;
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0;
    }

    .class-selector select {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      cursor: pointer;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .class-info h3 {
      color: #1e293b;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
    }

    .class-info p {
      color: #64748b;
      margin: 0;
    }

    .quick-actions {
      display: flex;
      gap: 0.5rem;
    }

    .quick-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quick-btn.present {
      background: #dcfce7;
      color: #166534;
    }

    .quick-btn.absent {
      background: #fee2e2;
      color: #dc2626;
    }

    .error-message {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .loading-message {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: center;
    }

    .info-message {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .section-info {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0.25rem 0;
    }

    .students-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .student-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .student-card:hover {
      border-color: #10b981;
      transform: translateY(-2px);
    }

    .student-info {
      margin-bottom: 1rem;
    }

    .student-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 1rem;
    }

    .student-roll {
      color: #64748b;
      font-size: 0.9rem;
    }

    .attendance-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .attendance-btn {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .attendance-btn.present {
      color: #166534;
    }

    .attendance-btn.present.active {
      background: #dcfce7;
      border-color: #10b981;
    }

    .attendance-btn.late {
      color: #d97706;
    }

    .attendance-btn.late.active {
      background: #fef3c7;
      border-color: #f59e0b;
    }

    .attendance-btn.absent {
      color: #dc2626;
    }

    .attendance-btn.absent.active {
      background: #fee2e2;
      border-color: #ef4444;
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .attendance-summary {
      display: flex;
      gap: 1rem;
    }

    .summary-item {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .summary-item.present {
      background: #dcfce7;
      color: #166534;
    }

    .summary-item.late {
      background: #fef3c7;
      color: #d97706;
    }

    .summary-item.absent {
      background: #fee2e2;
      color: #dc2626;
    }

    .save-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .save-btn:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .attendance-history h2 {
      color: #1e293b;
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .records-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .record-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-left: 4px solid #10b981;
    }

    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .record-info h3 {
      color: #1e293b;
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
    }

    .record-info p {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0;
    }

    .attendance-percentage {
      font-size: 1.5rem;
      font-weight: 700;
      color: #10b981;
    }

    .record-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-item .count {
      display: block;
      font-size: 1.2rem;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-item .label {
      font-size: 0.8rem;
      color: #64748b;
    }

    .stat-item.present .count {
      color: #10b981;
    }

    .stat-item.late .count {
      color: #f59e0b;
    }

    .stat-item.absent .count {
      color: #ef4444;
    }

    .progress-bar {
      background: #f1f5f9;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(135deg, #10b981, #059669);
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    @media (max-width: 768px) {
      .attendance-container {
        padding: 1rem;
      }
      
      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .form-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .form-footer {
        flex-direction: column;
        gap: 1rem;
      }
      
      .students-grid {
        grid-template-columns: 1fr;
      }
      
      .records-grid {
        grid-template-columns: 1fr;
      }
      
      .attendance-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class TeacherAttendanceComponent implements OnInit {
    selectedClass: string = '';
  selectedSection: string = '';
  selectedSubject: string = '';
  availableClasses: string[] = [];
  availableSections: string[] = [];
  students: Student[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Stats from API
  overallAttendancePercentage = 0;
  todayPresentCount = 0;
  totalClassesTaken = 0;
  averageClassSize = 0;

  attendanceRecords: AttendanceRecord[] = [];
  
  constructor(private teacherDashboardService: TeacherDashboardService) {}
  
  ngOnInit() {
    this.loadInitialData();
  }
  
  private async loadInitialData() {
    try {
      await this.loadTeacherClasses();
      await this.loadAttendanceStats();
      await this.loadAttendanceRecords();
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.errorMessage = 'Failed to load attendance data';
    }
  }
  
  private loadTeacherClasses() {
    return new Promise((resolve, reject) => {
      this.teacherDashboardService.getClassesForAttendance().subscribe({
        next: (response) => {
          if (response.success) {
            this.availableClasses = response.classes.map((c: any) => c.class);
            if (this.availableClasses.length > 0 && !this.selectedClass) {
              this.selectedClass = this.availableClasses[0];
            }
          }
          resolve(response);
        },
        error: (error) => {
          console.error('Error loading classes:', error);
          reject(error);
        }
      });
    });
  }
  
  private loadAttendanceStats() {
    return new Promise((resolve, reject) => {
      this.teacherDashboardService.getAttendanceStats().subscribe({
        next: (response) => {
          if (response.success) {
            const stats = response.stats;
            this.overallAttendancePercentage = stats.overallAttendance;
            this.todayPresentCount = stats.todayPresent;
            this.totalClassesTaken = stats.totalClasses;
            this.averageClassSize = stats.averageClassSize;
          }
          resolve(response);
        },
        error: (error) => {
          console.error('Error loading attendance stats:', error);
          reject(error);
        }
      });
    });
  }
  
  private loadAttendanceRecords() {
    return new Promise((resolve, reject) => {
      this.teacherDashboardService.getAttendanceRecords({ limit: 10 }).subscribe({
        next: (response) => {
          if (response.success) {
            this.attendanceRecords = response.records.map((record: any) => ({
              ...record,
              date: new Date(record.date)
            }));
          }
          resolve(response);
        },
        error: (error) => {
          console.error('Error loading attendance records:', error);
          reject(error);
        }
      });
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onClassChange() {
    this.selectedSection = '';
    this.selectedSubject = '';
    if (this.selectedClass) {
      // Load available sections for selected class
      this.availableSections = ['A', 'B', 'C']; // This would come from API
    } else {
      this.availableSections = [];
    }
    this.students = [];
  }

  onSectionChange() {
    if (this.selectedClass && this.selectedSection) {
      this.loadStudents();
    }
  }

  loadStudents() {
    if (!this.selectedClass || !this.selectedSection) {
      this.students = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.teacherDashboardService.getStudentsForAttendance(this.selectedClass, this.selectedSection).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.students = response.students.map((student: any) => ({
            ...student,
            status: 'present' // Default to present
          }));
        } else {
          this.errorMessage = 'Failed to load students';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading students:', error);
        this.errorMessage = 'Error loading students. Please try again.';
      }
    });
  }

  markAttendance(student: Student, status: 'present' | 'absent' | 'late') {
    student.status = status;
  }

  markAll(status: 'present' | 'absent') {
    console.log('Mark All clicked:', status);
    console.log('Students array:', this.students);
    console.log('Students count:', this.students.length);
    
    if (this.students.length === 0) {
      console.log('No students loaded. Please select a class and section first.');
      this.errorMessage = 'No students loaded. Please select a class and section first.';
      return;
    }
    
    this.students.forEach(student => {
      student.status = status;
    });
    
    console.log('Updated students:', this.students);
    
    // Clear any previous error messages
    this.errorMessage = '';
  }

  hasMarkedAttendance(): boolean {
    return this.students.some(student => student.status !== null);
  }

  getCountByStatus(status: 'present' | 'absent' | 'late'): number {
    return this.students.filter(student => student.status === status).length;
  }

  saveAttendance() {
    if (!this.hasMarkedAttendance()) {
      this.errorMessage = 'Please mark attendance for at least one student';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const attendanceData = {
      class: this.selectedClass,
      section: this.selectedSection,
      subject: this.selectedSubject,
      date: this.teacherDashboardService.formatDateForAPI(new Date()),
      period: 1,
      attendanceData: this.students.map(student => ({
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        status: student.status || 'absent'
      }))
    };

    this.teacherDashboardService.markAttendance(attendanceData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Reset form
          this.students.forEach(student => student.status = null);
          
          // Reload data
          this.loadAttendanceStats();
          this.loadAttendanceRecords();
          
          alert('Attendance saved successfully!');
        } else {
          this.errorMessage = response.message || 'Failed to save attendance';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error saving attendance:', error);
        this.errorMessage = 'Error saving attendance. Please try again.';
      }
    });
  }

  getSubjectByClass(className: string): string {
    const subjects: {[key: string]: string} = {
      '10A': 'Mathematics',
      '10B': 'Science',
      '10C': 'English'
    };
    return subjects[className] || 'General';
  }

  getOverallAttendance(): string {
    return this.overallAttendancePercentage.toString();
  }

  getTodayPresent(): number {
    return this.todayPresentCount;
  }

  getAverageClassSize(): number {
    return this.averageClassSize;
  }
  
  // Helper methods for attendance display

  getAttendancePercentage(record: AttendanceRecord): number {
    const presentStudents = record.presentCount + record.lateCount;
    return Math.round((presentStudents / record.totalStudents) * 100);
  }
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}