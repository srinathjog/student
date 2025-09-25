import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status?: 'present' | 'absent' | 'late' | 'excused' | null;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  class: string;
  section: string;
  subject: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  section: string;
  assignedDate: string;
  dueDate: string;
  status: 'active' | 'completed' | 'cancelled';
  totalStudents: number;
  submissionCount: number;
  submissionRate: number;
}

export interface StudentProgress {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  gpa: number;
  percentage: number;
  grade: string;
  attendance: number;
  recentGrade: string;
  totalMarks: number;
  obtainedMarks: number;
  rank: number;
  teacherRemarks: string;
}

export interface TeacherClass {
  class: string;
  sections: string[];
  totalStudents: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardService {
  private baseUrl = '/api/teacher-dashboard';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    // Check if we're in browser environment
    const token = typeof window !== 'undefined' && localStorage ? localStorage.getItem('token') : null;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // =====================================================
  // ATTENDANCE MANAGEMENT
  // =====================================================

  // Get students for attendance marking
  getStudentsForAttendance(className: string, section: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/attendance/students/${className}/${section}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Mark attendance for a class
  markAttendance(attendanceData: {
    class: string;
    section: string;
    subject: string;
    date: string;
    period?: number;
    attendanceData: any[];
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/attendance/mark`,
      attendanceData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get attendance records
  getAttendanceRecords(params: {
    page?: number;
    limit?: number;
    class?: string;
    subject?: string;
  } = {}): Observable<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    return this.http.get(
      `${this.baseUrl}/attendance/records?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get attendance statistics
  getAttendanceStats(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/attendance/stats`,
      { headers: this.getAuthHeaders() }
    );
  }

  // =====================================================
  // HOMEWORK MANAGEMENT
  // =====================================================

  // Get homework assignments
  getHomeworkAssignments(params: {
    page?: number;
    limit?: number;
    status?: string;
    class?: string;
  } = {}): Observable<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    return this.http.get(
      `${this.baseUrl}/homework?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Create new homework assignment
  createHomework(homeworkData: {
    title: string;
    description: string;
    subject: string;
    class: string;
    section: string;
    dueDate: string;
    maxMarks?: number;
    instructions?: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/homework`,
      homeworkData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get homework statistics
  getHomeworkStats(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/homework/stats`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get homework submissions
  getHomeworkSubmissions(homeworkId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/homework/${homeworkId}/submissions`,
      { headers: this.getAuthHeaders() }
    );
  }

  // =====================================================
  // STUDENT PROGRESS MANAGEMENT
  // =====================================================

  // Get student progress data
  getStudentProgress(params: {
    page?: number;
    limit?: number;
    class?: string;
    section?: string;
    subject?: string;
    term?: string;
    academicYear?: string;
  } = {}): Observable<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    return this.http.get(
      `${this.baseUrl}/students/progress?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get student progress statistics
  getStudentProgressStats(params: {
    class?: string;
    subject?: string;
    term?: string;
    academicYear?: string;
  } = {}): Observable<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    return this.http.get(
      `${this.baseUrl}/students/progress/stats?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // =====================================================
  // GENERAL APIS
  // =====================================================

  // Get teacher's assigned classes
  getTeacherClasses(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/classes`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get attendance data for teacher
  getAttendanceData(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/attendance`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get classes for attendance management
  getClassesForAttendance(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/attendance/classes`,
      { headers: this.getAuthHeaders() }
    );
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  // Format date for API calls
  formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Calculate attendance percentage
  calculateAttendancePercentage(present: number, total: number): number {
    return total > 0 ? Math.round((present / total) * 100) : 0;
  }

  // Get grade color based on percentage
  getGradeColor(grade: string): string {
    const gradeColors: { [key: string]: string } = {
      'A+': '#10b981', // green
      'A': '#059669',  // green-600
      'B+': '#3b82f6', // blue
      'B': '#2563eb',  // blue-600
      'C+': '#f59e0b', // yellow
      'C': '#d97706',  // yellow-600
      'D': '#ef4444',  // red
      'F': '#dc2626'   // red-600
    };
    return gradeColors[grade] || '#6b7280';
  }

  // Get status color for homework/attendance
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'active': '#3b82f6',
      'completed': '#10b981',
      'cancelled': '#ef4444',
      'present': '#10b981',
      'absent': '#ef4444',
      'late': '#f59e0b',
      'excused': '#8b5cf6'
    };
    return statusColors[status] || '#6b7280';
  }
}