import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-digital-learning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Digital Learning</h1>
      <div class="digital-learning-content">
        <div class="course-grid">
          <div class="course-card">
            <h3 class="course-title">Mathematics</h3>
            <p class="course-progress">Progress: 75%</p>
            <button class="btn-primary">Continue Learning</button>
          </div>
          <div class="course-card">
            <h3 class="course-title">Science</h3>
            <p class="course-progress">Progress: 60%</p>
            <button class="btn-primary">Continue Learning</button>
          </div>
          <div class="course-card">
            <h3 class="course-title">English</h3>
            <p class="course-progress">Progress: 90%</p>
            <button class="btn-primary">Continue Learning</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../parent-dashboard.component.scss']
})
export class DigitalLearningComponent {
}