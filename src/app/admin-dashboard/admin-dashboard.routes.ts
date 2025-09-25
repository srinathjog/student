import { Routes } from '@angular/router';
import { ChildFormComponent } from '../admin/child-form/child-form.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { StudentsComponent } from './students/students.component';
import { StudentsResolver } from './students/students.resolver';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
  { path: 'students', component: StudentsComponent, resolve: { students: StudentsResolver } },
  { path: 'add-student', component: ChildFormComponent }
  // Add more admin child routes here
    ]
  }
];
