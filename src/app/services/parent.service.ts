
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface ParentStudent {
  name: string;
  age: number;
  grade: string;
}

@Injectable({ providedIn: 'root' })
export class ParentService {
  constructor(private http: HttpClient) {}

  getStudentsForParent(parentId: string): Observable<ParentStudent[]> {
    return this.http.get<ParentStudent[]>(`${environment.apiBaseUrl}/parent/${parentId}/students`);
  }

  login(username: string, password: string): Observable<{ message: string, token?: string, child?: any }> {
    return this.http.post<{ message: string, token?: string, child?: any }>(`${environment.apiBaseUrl}/parent-login`, { username, password });
  }
}
