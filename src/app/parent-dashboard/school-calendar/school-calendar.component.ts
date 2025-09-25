import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-school-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">School Calendar</h1>
      <div class="calendar-content">
        <div class="calendar-events">
          <div class="event-item">
            <div class="event-date">Dec 25</div>
            <div class="event-details">
              <h3 class="event-title">Winter Break</h3>
              <p class="event-description">School holiday</p>
            </div>
          </div>
          <div class="event-item">
            <div class="event-date">Jan 15</div>
            <div class="event-details">
              <h3 class="event-title">Parent-Teacher Meeting</h3>
              <p class="event-description">Individual sessions with teachers</p>
            </div>
          </div>
          <div class="event-item">
            <div class="event-date">Feb 14</div>
            <div class="event-details">
              <h3 class="event-title">Science Fair</h3>
              <p class="event-description">Student science projects exhibition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../parent-dashboard.component.scss']
})
export class SchoolCalendarComponent {
}