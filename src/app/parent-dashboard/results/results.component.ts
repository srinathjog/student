import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Results</h1>
      <div class="results-content">
        <div class="grade-summary">
          <div class="grade-card">
            <h3 class="subject">Mathematics</h3>
            <div class="grade">A+</div>
            <div class="percentage">95%</div>
          </div>
          <div class="grade-card">
            <h3 class="subject">Science</h3>
            <div class="grade">A</div>
            <div class="percentage">88%</div>
          </div>
          <div class="grade-card">
            <h3 class="subject">English</h3>
            <div class="grade">A+</div>
            <div class="percentage">92%</div>
          </div>
          <div class="grade-card">
            <h3 class="subject">History</h3>
            <div class="grade">B+</div>
            <div class="percentage">82%</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../parent-dashboard.component.scss']
})
export class ResultsComponent {
}