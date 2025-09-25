import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  class: string;
  gpa: number;
  attendance: number;
  recentGrade: string;
}

@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-progress.component.html',
  styleUrls: ['./student-progress.component.scss']
})
export class StudentProgressComponent {
  selectedClass = 'all';
  searchTerm = '';
  currentPage = 1;
  studentsPerPage = 15;
  filteredStudents: Student[] = [];
  students: Student[] = [];

  constructor() {
    this.initializeStudents();
    this.filterStudents();
  }

  private initializeStudents() {
    this.students = [
      // Class 10A - 45 students (Boys Section)
      { id: 1, name: 'Aarav Singh', rollNumber: '10A01', class: 'Class 10A', gpa: 3.8, attendance: 95, recentGrade: 'A' },
      { id: 2, name: 'Vivaan Sharma', rollNumber: '10A02', class: 'Class 10A', gpa: 3.6, attendance: 92, recentGrade: 'B+' },
      { id: 3, name: 'Aditya Patel', rollNumber: '10A03', class: 'Class 10A', gpa: 3.4, attendance: 88, recentGrade: 'B' },
      { id: 4, name: 'Vihaan Kumar', rollNumber: '10A04', class: 'Class 10A', gpa: 3.9, attendance: 97, recentGrade: 'A' },
            // Class 10A continued
      { id: 6, name: 'Sai Verma', rollNumber: '10A06', class: 'Class 10A', gpa: 3.2, attendance: 85, recentGrade: 'B' },
      { id: 7, name: 'Reyansh Agarwal', rollNumber: '10A07', class: 'Class 10A', gpa: 3.7, attendance: 93, recentGrade: 'B+' },
      { id: 8, name: 'Ayaan Jain', rollNumber: '10A08', class: 'Class 10A', gpa: 3.3, attendance: 87, recentGrade: 'B' },
      { id: 9, name: 'Krishna Bansal', rollNumber: '10A09', class: 'Class 10A', gpa: 3.8, attendance: 94, recentGrade: 'A-' },
      { id: 10, name: 'Ishaan Reddy', rollNumber: '10A10', class: 'Class 10A', gpa: 3.6, attendance: 91, recentGrade: 'B+' },
      // Add 35 more for Class 10A...
      { id: 11, name: 'Shaurya Khan', rollNumber: '10A11', class: 'Class 10A', gpa: 3.4, attendance: 89, recentGrade: 'B' },
      { id: 12, name: 'Atharv Rao', rollNumber: '10A12', class: 'Class 10A', gpa: 3.9, attendance: 96, recentGrade: 'A' },
      { id: 13, name: 'Arnav Das', rollNumber: '10A13', class: 'Class 10A', gpa: 3.5, attendance: 88, recentGrade: 'B+' },
      { id: 14, name: 'Rudra Bhatt', rollNumber: '10A14', class: 'Class 10A', gpa: 3.8, attendance: 94, recentGrade: 'A-' },
      { id: 15, name: 'Yuvraj Pandey', rollNumber: '10A15', class: 'Class 10A', gpa: 3.6, attendance: 90, recentGrade: 'B+' },
      { id: 16, name: 'Atharva Mishra', rollNumber: '10A16', class: 'Class 10A', gpa: 3.2, attendance: 84, recentGrade: 'B' },
      { id: 17, name: 'Shivansh Tiwari', rollNumber: '10A17', class: 'Class 10A', gpa: 3.9, attendance: 96, recentGrade: 'A' },
      { id: 18, name: 'Kairav Shah', rollNumber: '10A18', class: 'Class 10A', gpa: 3.5, attendance: 87, recentGrade: 'B+' },

      // Class 10B - 43 students (Girls Section)
      { id: 46, name: 'Ananya Singh', rollNumber: '10B01', class: 'Class 10B', gpa: 3.5, attendance: 91, recentGrade: 'B+' },
      { id: 47, name: 'Diya Sharma', rollNumber: '10B02', class: 'Class 10B', gpa: 3.8, attendance: 96, recentGrade: 'A' },
      { id: 48, name: 'Priya Patel', rollNumber: '10B03', class: 'Class 10B', gpa: 3.3, attendance: 87, recentGrade: 'B' },
      { id: 49, name: 'Kavya Kumar', rollNumber: '10B04', class: 'Class 10B', gpa: 3.6, attendance: 93, recentGrade: 'B+' },
      { id: 50, name: 'Aadhya Gupta', rollNumber: '10B05', class: 'Class 10B', gpa: 3.9, attendance: 98, recentGrade: 'A' },

      // Class 9A - 40 students (Science Section)
      { id: 131, name: 'Aadhya Bansal', rollNumber: '9A01', class: 'Class 9A', gpa: 3.6, attendance: 89, recentGrade: 'B+' },
      { id: 132, name: 'Agastya Joshi', rollNumber: '9A02', class: 'Class 9A', gpa: 3.8, attendance: 93, recentGrade: 'A-' },
      { id: 133, name: 'Ahaan Chouhan', rollNumber: '9A03', class: 'Class 9A', gpa: 3.4, attendance: 85, recentGrade: 'B' },
      { id: 134, name: 'Amaira Soni', rollNumber: '9A04', class: 'Class 9A', gpa: 3.9, attendance: 96, recentGrade: 'A' },
      { id: 135, name: 'Arham Goyal', rollNumber: '9A05', class: 'Class 9A', gpa: 3.5, attendance: 87, recentGrade: 'B+' },

      // Class 8A - 45 students (Junior Section)
      { id: 171, name: 'Aarush Tripathi', rollNumber: '8A01', class: 'Class 8A', gpa: 3.5, attendance: 88, recentGrade: 'B+' },
      { id: 172, name: 'Anika Khanna', rollNumber: '8A02', class: 'Class 8A', gpa: 3.7, attendance: 91, recentGrade: 'B+' },
      { id: 173, name: 'Arnav Menon', rollNumber: '8A03', class: 'Class 8A', gpa: 3.3, attendance: 84, recentGrade: 'B' },
      { id: 174, name: 'Avni Bhatia', rollNumber: '8A04', class: 'Class 8A', gpa: 3.8, attendance: 93, recentGrade: 'A-' },
      { id: 175, name: 'Darsh Goel', rollNumber: '8A05', class: 'Class 8A', gpa: 3.4, attendance: 86, recentGrade: 'B' },
      // Total of 30+ students shown here for demonstration
      { id: 30, name: 'Sample Last Student', rollNumber: '8A30', class: 'Class 8A', gpa: 3.6, attendance: 89, recentGrade: 'B+' }
    ];
  }

  selectClass(className: string) {
    this.selectedClass = className;
    this.currentPage = 1;
    this.filterStudents();
  }

  getUniqueClasses(): string[] {
    return [...new Set(this.students.map(s => s.class))];
  }

  getStudentsByClass(className: string) {
    return this.students.filter(s => s.class === className);
  }

  filterStudents() {
    let filtered = this.students;
    if (this.selectedClass !== 'all') {
      filtered = filtered.filter(student => student.class === this.selectedClass);
    }
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredStudents = filtered;
    this.currentPage = 1;
  }

  getPaginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.studentsPerPage;
    const endIndex = startIndex + this.studentsPerPage;
    return this.filteredStudents.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.studentsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.studentsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.studentsPerPage, this.filteredStudents.length);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  getTotalStudents(): number {
    return this.students.length;
  }

  getDisplayTitle(): string {
    return this.selectedClass === 'all' ? 'All Students' : this.selectedClass;
  }

  getAverageGPA(): string {
    if (this.filteredStudents.length === 0) return '0.0';
    const average = this.filteredStudents.reduce((sum, student) => sum + student.gpa, 0) / this.filteredStudents.length;
    return average.toFixed(1);
  }

  getAverageAttendance(): string {
    if (this.filteredStudents.length === 0) return '0';
    const average = this.filteredStudents.reduce((sum, student) => sum + student.attendance, 0) / this.filteredStudents.length;
    return Math.round(average).toString();
  }
}

