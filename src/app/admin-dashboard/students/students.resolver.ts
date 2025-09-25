import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentsResolver implements Resolve<any[]> {
  constructor(private http: HttpClient) {}

  resolve(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/students`);
  }
}
