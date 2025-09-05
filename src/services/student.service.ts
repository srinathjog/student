import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../app/environments/environment';

export interface Student {
  id?: string;
  name: string;
  age: number;
  grade: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = `${environment.apiBaseUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
