import { Component, signal } from '@angular/core';
import { StudentComponent } from "./student/student.component";

@Component({
  selector: 'app-root',
  imports: [StudentComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('student');
}
