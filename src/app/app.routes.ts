
import { Routes } from '@angular/router';
import { ParentLoginComponent } from './parent-login/parent-login';
import { AdminLoginComponent } from './admin-login/admin-login';
import { StudentComponent } from './student/student.component';
import { ParentDashboardComponent } from './parent-dashboard/parent-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LandingComponent } from './landing.component';
import { DashboardOverviewComponent } from './parent-dashboard/dashboard-overview/dashboard-overview.component';
import { CommunicationComponent } from './parent-dashboard/communication/communication.component';
import { HomeworkComponent } from './parent-dashboard/homework/homework.component';
import { DigitalLearningComponent } from './parent-dashboard/digital-learning/digital-learning.component';
import { FeesComponent } from './parent-dashboard/fees/fees.component';
import { ResultsComponent } from './parent-dashboard/results/results.component';
import { SchoolCalendarComponent } from './parent-dashboard/school-calendar/school-calendar.component';
import { ImageGalleryComponent } from './parent-dashboard/image-gallery/image-gallery.component';
import { TransportComponent } from './parent-dashboard/transport/transport.component';
import { RequestsComponent } from './parent-dashboard/requests/requests.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherOverviewComponent } from './teacher-dashboard/overview/teacher-overview.component';
import { TeacherHomeworkComponent } from './teacher-dashboard/homework/teacher-homework.component';
import { TeacherAttendanceComponent } from './teacher-dashboard/attendance/teacher-attendance.component';
import { MyClassesComponent } from './teacher-dashboard/my-classes/my-classes.component';
import { StudentProgressComponent } from './teacher-dashboard/student-progress/student-progress.component';
import { TeacherProfileComponent } from './teacher-dashboard/profile/teacher-profile.component';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';

export const routes: Routes = [
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'parent-login', component: ParentLoginComponent },
  { path: 'teacher-login', component: TeacherLoginComponent },
  { 
    path: 'parent-dashboard', 
    component: ParentDashboardComponent, 
    children: [
      { path: '', component: DashboardOverviewComponent },
      { path: 'overview', component: DashboardOverviewComponent },
      { path: 'communication', component: CommunicationComponent },
      { path: 'homework', component: HomeworkComponent },
      { path: 'digital-learning', component: DigitalLearningComponent },
      { path: 'fees', component: FeesComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'school-calendar', component: SchoolCalendarComponent },
      { path: 'image-gallery', component: ImageGalleryComponent },
      { path: 'transport', component: TransportComponent },
      { path: 'requests', component: RequestsComponent }
    ]
  },
  { 
    path: 'teacher-dashboard', 
    component: TeacherDashboardComponent, 
    children: [
      { path: '', component: TeacherOverviewComponent },
      { path: 'overview', component: TeacherOverviewComponent },
      { path: 'my-classes', component: MyClassesComponent },
      { path: 'attendance', component: TeacherAttendanceComponent },
      { path: 'homework', component: TeacherHomeworkComponent },
      { path: 'student-progress', component: StudentProgressComponent },
      { path: 'profile', component: TeacherProfileComponent }
    ]
  },
  { path: 'students', component: StudentComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes').then(m => m.adminRoutes)
  },
  // Redirect legacy teacher routes to correct teacher-dashboard routes
  { path: 'teacher/my-classes', redirectTo: 'teacher-dashboard/my-classes' },
  { path: 'teacher/attendance', redirectTo: 'teacher-dashboard/attendance' },
  { path: 'teacher/homework', redirectTo: 'teacher-dashboard/homework' },
  { path: 'teacher/student-progress', redirectTo: 'teacher-dashboard/student-progress' },
  { path: 'teacher/profile', redirectTo: 'teacher-dashboard/profile' },
  { path: 'teacher/overview', redirectTo: 'teacher-dashboard/overview' },
  { path: '', component: LandingComponent, pathMatch: 'full' }
];
