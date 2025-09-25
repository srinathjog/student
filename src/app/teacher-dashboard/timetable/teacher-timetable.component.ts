import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  duration: number;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  color: string;
}

interface ClassRoom {
  id: number;
  name: string;
  capacity: number;
  type: 'classroom' | 'lab' | 'auditorium' | 'library';
  equipment: string[];
}

interface TimetableEntry {
  id: number;
  day: string;
  timeSlotId: number;
  subjectId: number;
  classId: string;
  roomId: number;
  teacherId?: number;
  isSubstitute?: boolean;
  substituteTeacher?: string;
  notes?: string;
}

interface TeacherSchedule {
  teacherId: number;
  teacherName: string;
  entries: TimetableEntry[];
  totalHours: number;
  freeSlots: number;
}

@Component({
  selector: 'app-teacher-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="timetable-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">📅 Timetable & Schedule</h1>
        <p class="page-subtitle">Manage teaching schedules, class timetables, and room allocations</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card classes">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-number">{{ getTotalClassesToday() }}</div>
            <div class="stat-label">Classes Today</div>
          </div>
        </div>
        <div class="stat-card hours">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-number">{{ getTotalHoursToday() }}</div>
            <div class="stat-label">Teaching Hours</div>
          </div>
        </div>
        <div class="stat-card free">
          <div class="stat-icon">☕</div>
          <div class="stat-content">
            <div class="stat-number">{{ getFreePeriodsToday() }}</div>
            <div class="stat-label">Free Periods</div>
          </div>
        </div>
        <div class="stat-card substitutes">
          <div class="stat-icon">🔄</div>
          <div class="stat-content">
            <div class="stat-number">{{ getSubstitutesToday() }}</div>
            <div class="stat-label">Substitutes</div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-container">
        <button class="tab-btn" [class.active]="activeTab === 'weekly'" (click)="setActiveTab('weekly')">
          📅 Weekly View
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'daily'" (click)="setActiveTab('daily')">
          📋 Daily Schedule
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'rooms'" (click)="setActiveTab('rooms')">
          🏫 Room Management
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'substitutes'" (click)="setActiveTab('substitutes')">
          🔄 Substitutes
        </button>
      </div>

      <!-- Weekly View Tab -->
      <div class="tab-content" *ngIf="activeTab === 'weekly'">
        <div class="weekly-controls">
          <div class="week-navigation">
            <button class="nav-btn" (click)="previousWeek()">← Previous Week</button>
            <div class="current-week">
              Week of {{ getCurrentWeekStart() | date:'MMM dd, yyyy' }}
            </div>
            <button class="nav-btn" (click)="nextWeek()">Next Week →</button>
          </div>
          <div class="view-options">
            <select [(ngModel)]="selectedTeacher">
              <option value="">My Schedule</option>
              <option value="all">All Teachers</option>
              <option value="john">John Smith</option>
              <option value="mary">Mary Johnson</option>
            </select>
            <button class="print-btn" (click)="printTimetable()">🖨️ Print</button>
          </div>
        </div>

        <div class="timetable-grid">
          <!-- Time Slots Header -->
          <div class="time-header"></div>
          <div *ngFor="let day of weekDays" class="day-header">
            <div class="day-name">{{ day }}</div>
            <div class="day-date">{{ getDayDate(day) | date:'MMM dd' }}</div>
          </div>

          <!-- Time Rows -->
          <ng-container *ngFor="let slot of timeSlots">
            <div class="time-slot">
              <div class="time-label">{{ slot.startTime }}</div>
              <div class="time-range">{{ slot.startTime }} - {{ slot.endTime }}</div>
            </div>
            
            <div *ngFor="let day of weekDays" class="schedule-cell" 
                 [class.has-class]="hasClass(day, slot.id)"
                 [class.substitute]="isSubstitute(day, slot.id)"
                 [class.free]="!hasClass(day, slot.id)">
              
              <div *ngIf="getClassEntry(day, slot.id) as entry" class="class-entry" 
                   [style.background-color]="getSubjectColor(entry.subjectId)">
                <div class="class-header">
                  <div class="subject-name">{{ getSubjectName(entry.subjectId) }}</div>
                  <div class="class-code">{{ entry.classId }}</div>
                </div>
                <div class="class-details">
                  <div class="room-info">🏫 {{ getRoomName(entry.roomId) }}</div>
                  <div class="substitute-info" *ngIf="entry.isSubstitute">
                    🔄 {{ entry.substituteTeacher }}
                  </div>
                </div>
                <div class="class-actions">
                  <button class="edit-btn" (click)="editClass(entry)">✏️</button>
                  <button class="substitute-btn" (click)="arrangeSubstitute(entry)">🔄</button>
                </div>
              </div>

              <div *ngIf="!hasClass(day, slot.id)" class="free-slot">
                <div class="free-label">Free Period</div>
                <button class="add-class-btn" (click)="addClass(day, slot.id)">+ Add Class</button>
              </div>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Daily Schedule Tab -->
      <div class="tab-content" *ngIf="activeTab === 'daily'">
        <div class="daily-controls">
          <div class="date-selector">
            <input type="date" [(ngModel)]="selectedDate" (change)="loadDaySchedule()">
            <div class="day-name">{{ selectedDate | date:'EEEE' }}</div>
          </div>
          <div class="daily-actions">
            <button class="export-btn" (click)="exportDaySchedule()">📥 Export</button>
            <button class="notify-btn" (click)="notifyChanges()">📱 Notify Changes</button>
          </div>
        </div>

        <div class="daily-schedule">
          <div class="schedule-timeline">
            <div *ngFor="let entry of getDayEntries()" class="timeline-entry" 
                 [class.current]="isCurrentClass(entry)"
                 [class.next]="isNextClass(entry)"
                 [class.substitute]="entry.isSubstitute">
              
              <div class="time-marker">
                <div class="time-display">{{ getTimeSlot(entry.timeSlotId)?.startTime }}</div>
                <div class="duration">{{ getTimeSlot(entry.timeSlotId)?.duration }}min</div>
              </div>

              <div class="class-card">
                <div class="card-header" [style.background-color]="getSubjectColor(entry.subjectId)">
                  <div class="subject-info">
                    <div class="subject-name">{{ getSubjectName(entry.subjectId) }}</div>
                    <div class="subject-code">{{ getSubjectCode(entry.subjectId) }}</div>
                  </div>
                  <div class="class-info">
                    <div class="class-name">{{ entry.classId }}</div>
                    <div class="room-name">{{ getRoomName(entry.roomId) }}</div>
                  </div>
                </div>

                <div class="card-content">
                  <div class="class-details-grid">
                    <div class="detail-item">
                      <span class="label">Time:</span>
                      <span class="value">{{ getTimeSlot(entry.timeSlotId)?.startTime }} - {{ getTimeSlot(entry.timeSlotId)?.endTime }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Room:</span>
                      <span class="value">{{ getRoomName(entry.roomId) }} ({{ getRoomType(entry.roomId) }})</span>
                    </div>
                    <div class="detail-item" *ngIf="entry.isSubstitute">
                      <span class="label">Substitute:</span>
                      <span class="value substitute-name">{{ entry.substituteTeacher }}</span>
                    </div>
                    <div class="detail-item" *ngIf="entry.notes">
                      <span class="label">Notes:</span>
                      <span class="value">{{ entry.notes }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-actions">
                  <button class="action-btn attendance" (click)="markAttendance(entry)">
                    📋 Attendance
                  </button>
                  <button class="action-btn materials" (click)="viewMaterials(entry)">
                    📚 Materials
                  </button>
                  <button class="action-btn substitute" (click)="arrangeSubstitute(entry)">
                    🔄 Substitute
                  </button>
                  <button class="action-btn edit" (click)="editClass(entry)">
                    ✏️ Edit
                  </button>
                </div>
              </div>

              <div class="status-indicator">
                <div *ngIf="isCurrentClass(entry)" class="current-indicator">
                  🟢 Current Class
                </div>
                <div *ngIf="isNextClass(entry)" class="next-indicator">
                  🟡 Next Class
                </div>
                <div *ngIf="entry.isSubstitute" class="substitute-indicator">
                  🔄 Substitute Arranged
                </div>
              </div>
            </div>

            <div *ngIf="getDayEntries().length === 0" class="no-classes">
              <div class="no-classes-icon">☕</div>
              <div class="no-classes-message">No classes scheduled for this day</div>
              <button class="add-class-btn" (click)="addClassToDay()">+ Schedule Class</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Management Tab -->
      <div class="tab-content" *ngIf="activeTab === 'rooms'">
        <div class="rooms-header">
          <h3>🏫 Room Allocation & Management</h3>
          <div class="room-filters">
            <select [(ngModel)]="roomFilter">
              <option value="all">All Rooms</option>
              <option value="classroom">Classrooms</option>
              <option value="lab">Laboratories</option>
              <option value="auditorium">Auditoriums</option>
              <option value="library">Libraries</option>
            </select>
            <button class="add-room-btn" (click)="addNewRoom()">+ Add Room</button>
          </div>
        </div>

        <div class="rooms-grid">
          <div *ngFor="let room of getFilteredRooms()" class="room-card" [class]="room.type">
            <div class="room-header">
              <div class="room-info">
                <div class="room-name">{{ room.name }}</div>
                <div class="room-type">{{ room.type | titlecase }}</div>
              </div>
              <div class="room-capacity">
                👥 {{ room.capacity }}
              </div>
            </div>

            <div class="room-details">
              <div class="equipment-list" *ngIf="room.equipment.length > 0">
                <h5>Equipment:</h5>
                <div class="equipment-tags">
                  <span *ngFor="let item of room.equipment" class="equipment-tag">
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>

            <div class="room-schedule">
              <h5>Today's Schedule:</h5>
              <div class="room-bookings">
                <div *ngFor="let booking of getRoomBookings(room.id)" class="booking-item">
                  <div class="booking-time">{{ booking.time }}</div>
                  <div class="booking-class">{{ booking.class }}</div>
                  <div class="booking-subject">{{ booking.subject }}</div>
                </div>
                <div *ngIf="getRoomBookings(room.id).length === 0" class="no-bookings">
                  No bookings today
                </div>
              </div>
            </div>

            <div class="room-actions">
              <button class="action-btn view" (click)="viewRoomSchedule(room.id)">
                📅 View Schedule
              </button>
              <button class="action-btn book" (click)="bookRoom(room.id)">
                📝 Book Room
              </button>
              <button class="action-btn edit" (click)="editRoom(room)">
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Substitutes Tab -->
      <div class="tab-content" *ngIf="activeTab === 'substitutes'">
        <div class="substitutes-header">
          <h3>🔄 Substitute Management</h3>
          <div class="substitute-actions">
            <button class="request-btn" (click)="requestSubstitute()">
              🆘 Request Substitute
            </button>
            <button class="emergency-btn" (click)="emergencySubstitute()">
              🚨 Emergency Cover
            </button>
          </div>
        </div>

        <div class="substitute-requests">
          <h4>📋 Current Requests</h4>
          <div class="requests-list">
            <div *ngFor="let request of substituteRequests" class="request-item" [class]="request.status">
              <div class="request-info">
                <div class="request-details">
                  <div class="original-teacher">{{ request.originalTeacher }}</div>
                  <div class="absence-reason">{{ request.reason }}</div>
                  <div class="request-date">{{ request.date | date:'MMM dd, yyyy' }}</div>
                </div>
                <div class="class-details">
                  <div class="subject">{{ request.subject }}</div>
                  <div class="class-name">{{ request.class }}</div>
                  <div class="time-slot">{{ request.timeSlot }}</div>
                </div>
              </div>

              <div class="substitute-info" *ngIf="request.substituteTeacher">
                <div class="substitute-name">{{ request.substituteTeacher }}</div>
                <div class="substitute-status">{{ request.status | titlecase }}</div>
              </div>

              <div class="request-status">
                <span class="status-badge" [class]="request.status">
                  <span *ngIf="request.status === 'pending'">⏳ Pending</span>
                  <span *ngIf="request.status === 'assigned'">✅ Assigned</span>
                  <span *ngIf="request.status === 'rejected'">❌ Rejected</span>
                  <span *ngIf="request.status === 'emergency'">🚨 Emergency</span>
                </span>
              </div>

              <div class="request-actions">
                <button class="action-btn assign" 
                        (click)="assignSubstitute(request)"
                        *ngIf="request.status === 'pending'">
                  👤 Assign
                </button>
                <button class="action-btn contact" 
                        (click)="contactSubstitute(request)"
                        *ngIf="request.substituteTeacher">
                  📞 Contact
                </button>
                <button class="action-btn cancel" 
                        (click)="cancelRequest(request.id)"
                        *ngIf="request.status !== 'assigned'">
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="available-substitutes">
          <h4>👥 Available Substitute Teachers</h4>
          <div class="substitutes-grid">
            <div *ngFor="let substitute of availableSubstitutes" class="substitute-card">
              <div class="substitute-info">
                <div class="substitute-name">{{ substitute.name }}</div>
                <div class="substitute-subjects">{{ substitute.subjects.join(', ') }}</div>
                <div class="substitute-availability">
                  <span *ngIf="substitute.available" class="available">🟢 Available</span>
                  <span *ngIf="!substitute.available" class="unavailable">🔴 Busy</span>
                </div>
              </div>

              <div class="substitute-stats">
                <div class="stat-item">
                  <span class="label">Rating:</span>
                  <span class="value">⭐ {{ substitute.rating }}/5</span>
                </div>
                <div class="stat-item">
                  <span class="label">Experience:</span>
                  <span class="value">{{ substitute.experience }} years</span>
                </div>
                <div class="stat-item">
                  <span class="label">Last Used:</span>
                  <span class="value">{{ substitute.lastUsed | date:'MMM dd' }}</span>
                </div>
              </div>

              <div class="substitute-actions">
                <button class="action-btn assign" 
                        (click)="quickAssign(substitute)"
                        [disabled]="!substitute.available">
                  ⚡ Quick Assign
                </button>
                <button class="action-btn contact" (click)="contactTeacher(substitute)">
                  📞 Contact
                </button>
                <button class="action-btn profile" (click)="viewProfile(substitute)">
                  👤 Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timetable-container {
      padding: 0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .page-subtitle {
      color: #64748b;
      font-size: 1rem;
      font-weight: 400;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      border-left: 4px solid;
    }

    .stat-card.classes { border-left-color: #3b82f6; }
    .stat-card.hours { border-left-color: #10b981; }
    .stat-card.free { border-left-color: #f59e0b; }
    .stat-card.substitutes { border-left-color: #8b5cf6; }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Tabs */
    .tabs-container {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .tab-btn {
      padding: 1rem 1.5rem;
      border: none;
      background: none;
      color: #64748b;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      color: #3b82f6;
      background: #f8fafc;
    }

    .tab-btn.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
      background: #f0f9ff;
    }

    .tab-content {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    /* Weekly View */
    .weekly-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .week-navigation {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-weight: 600;
    }

    .current-week {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .view-options {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .view-options select {
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }

    .print-btn {
      background: #e0e7ff;
      color: #3730a3;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Timetable Grid */
    .timetable-grid {
      display: grid;
      grid-template-columns: 120px repeat(5, 1fr);
      gap: 1px;
      background: #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .time-header,
    .day-header {
      background: #1e293b;
      color: white;
      padding: 1rem;
      font-weight: 600;
      text-align: center;
    }

    .day-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .day-name {
      font-size: 1rem;
    }

    .day-date {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .time-slot {
      background: #f8fafc;
      padding: 1rem 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .time-label {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .time-range {
      font-size: 0.7rem;
      color: #64748b;
    }

    .schedule-cell {
      background: white;
      min-height: 80px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .schedule-cell.free {
      background: #f8fafc;
    }

    .schedule-cell.substitute {
      background: #fef3c7;
    }

    .class-entry {
      width: 100%;
      height: 100%;
      padding: 0.5rem;
      border-radius: 8px;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .class-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .subject-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .class-code {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    .class-details {
      font-size: 0.7rem;
      opacity: 0.9;
    }

    .class-actions {
      display: flex;
      gap: 0.25rem;
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .class-entry:hover .class-actions {
      opacity: 1;
    }

    .edit-btn,
    .substitute-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      font-size: 0.7rem;
      padding: 0.25rem;
    }

    .free-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
    }

    .free-label {
      font-size: 0.8rem;
      font-weight: 500;
    }

    .add-class-btn {
      background: #dbeafe;
      color: #1e40af;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.7rem;
      cursor: pointer;
      font-weight: 600;
    }

    /* Daily Schedule */
    .daily-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .date-selector {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .date-selector input {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }

    .day-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .daily-actions {
      display: flex;
      gap: 1rem;
    }

    .export-btn,
    .notify-btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .export-btn {
      background: #dcfce7;
      color: #166534;
    }

    .notify-btn {
      background: #dbeafe;
      color: #1e40af;
    }

    /* Schedule Timeline */
    .schedule-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .timeline-entry {
      display: grid;
      grid-template-columns: 120px 1fr 150px;
      gap: 1.5rem;
      align-items: center;
    }

    .timeline-entry.current {
      background: #f0fdf4;
      padding: 1rem;
      border-radius: 12px;
      border-left: 4px solid #10b981;
    }

    .timeline-entry.next {
      background: #fef3c7;
      padding: 1rem;
      border-radius: 12px;
      border-left: 4px solid #f59e0b;
    }

    .time-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .time-display {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .duration {
      font-size: 0.8rem;
      color: #64748b;
    }

    .class-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .subject-info,
    .class-info {
      display: flex;
      flex-direction: column;
    }

    .subject-name,
    .class-name {
      font-weight: 600;
    }

    .subject-code,
    .room-name {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    .card-content {
      padding: 1rem;
    }

    .class-details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .detail-item .label {
      color: #64748b;
      font-weight: 500;
    }

    .detail-item .value {
      color: #1e293b;
      font-weight: 600;
    }

    .substitute-name {
      color: #f59e0b !important;
    }

    .card-actions {
      padding: 1rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn.attendance { background: #f0fdf4; color: #166534; }
    .action-btn.materials { background: #f0f9ff; color: #1e40af; }
    .action-btn.substitute { background: #fef3c7; color: #92400e; }
    .action-btn.edit { background: #f3f4f6; color: #374151; }

    .status-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .current-indicator,
    .next-indicator,
    .substitute-indicator {
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      text-align: center;
    }

    .current-indicator {
      background: #dcfce7;
      color: #166534;
    }

    .next-indicator {
      background: #fef3c7;
      color: #92400e;
    }

    .substitute-indicator {
      background: #e0e7ff;
      color: #3730a3;
    }

    .no-classes {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }

    .no-classes-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .no-classes-message {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    /* Room Management */
    .rooms-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .rooms-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .room-filters {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .room-filters select {
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }

    .add-room-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .room-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 1.5rem;
      border-left: 4px solid;
    }

    .room-card.classroom { border-left-color: #3b82f6; }
    .room-card.lab { border-left-color: #10b981; }
    .room-card.auditorium { border-left-color: #8b5cf6; }
    .room-card.library { border-left-color: #f59e0b; }

    .room-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .room-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .room-type {
      font-size: 0.8rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 500;
    }

    .room-capacity {
      font-weight: 600;
      color: #374151;
    }

    .equipment-list h5,
    .room-schedule h5 {
      margin: 0 0 0.5rem 0;
      color: #374151;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .equipment-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .equipment-tag {
      background: #f1f5f9;
      color: #475569;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 500;
    }

    .room-bookings {
      max-height: 120px;
      overflow-y: auto;
    }

    .booking-item {
      display: grid;
      grid-template-columns: 60px 1fr 1fr;
      gap: 0.5rem;
      padding: 0.25rem 0;
      font-size: 0.8rem;
    }

    .booking-time {
      font-weight: 600;
      color: #374151;
    }

    .booking-class,
    .booking-subject {
      color: #64748b;
    }

    .no-bookings {
      color: #9ca3af;
      font-size: 0.8rem;
      font-style: italic;
    }

    .room-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .action-btn.view { background: #f0f9ff; color: #1e40af; }
    .action-btn.book { background: #f0fdf4; color: #166534; }

    /* Substitutes */
    .substitutes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .substitutes-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .substitute-actions {
      display: flex;
      gap: 1rem;
    }

    .request-btn,
    .emergency-btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .request-btn {
      background: #fbbf24;
      color: white;
    }

    .emergency-btn {
      background: #ef4444;
      color: white;
    }

    .substitute-requests h4,
    .available-substitutes h4 {
      margin: 2rem 0 1rem 0;
      color: #1e293b;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .request-item {
      display: grid;
      grid-template-columns: 2fr 1fr 120px 150px;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      align-items: center;
      border-left: 4px solid;
    }

    .request-item.pending { border-left-color: #f59e0b; }
    .request-item.assigned { border-left-color: #10b981; }
    .request-item.rejected { border-left-color: #ef4444; }
    .request-item.emergency { border-left-color: #dc2626; }

    .request-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .original-teacher {
      font-weight: 600;
      color: #1e293b;
    }

    .absence-reason,
    .request-date {
      font-size: 0.8rem;
      color: #64748b;
    }

    .class-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .subject {
      font-weight: 600;
      color: #374151;
    }

    .class-name,
    .time-slot {
      font-size: 0.8rem;
      color: #64748b;
    }

    .substitute-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .substitute-name {
      font-weight: 600;
      color: #10b981;
    }

    .substitute-status {
      font-size: 0.8rem;
      color: #64748b;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
      text-align: center;
    }

    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.assigned { background: #dcfce7; color: #166534; }
    .status-badge.rejected { background: #fee2e2; color: #dc2626; }
    .status-badge.emergency { background: #fee2e2; color: #dc2626; }

    .request-actions {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .action-btn.assign { background: #dcfce7; color: #166534; }
    .action-btn.contact { background: #dbeafe; color: #1e40af; }
    .action-btn.cancel { background: #fee2e2; color: #dc2626; }

    /* Available Substitutes */
    .substitutes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .substitute-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 1.5rem;
      border-left: 4px solid #10b981;
    }

    .substitute-info .substitute-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .substitute-subjects {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .substitute-availability {
      margin-bottom: 1rem;
    }

    .available {
      color: #10b981;
      font-weight: 600;
    }

    .unavailable {
      color: #ef4444;
      font-weight: 600;
    }

    .substitute-stats {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
    }

    .stat-item .label {
      color: #64748b;
    }

    .stat-item .value {
      color: #374151;
      font-weight: 600;
    }

    .substitute-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn.profile { background: #f5f3ff; color: #7c3aed; }

    /* Responsive */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .timetable-grid {
        grid-template-columns: 80px repeat(5, 1fr);
      }

      .timeline-entry {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .class-details-grid {
        grid-template-columns: 1fr;
      }

      .rooms-grid {
        grid-template-columns: 1fr;
      }

      .request-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .substitutes-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeacherTimetableComponent {
  activeTab = 'weekly';
  selectedDate = new Date().toISOString().split('T')[0];
  selectedTeacher = '';
  roomFilter = 'all';
  currentWeekStart = new Date();

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  timeSlots: TimeSlot[] = [
    { id: 1, startTime: '08:00', endTime: '08:45', duration: 45 },
    { id: 2, startTime: '08:45', endTime: '09:30', duration: 45 },
    { id: 3, startTime: '09:30', endTime: '10:15', duration: 45 },
    { id: 4, startTime: '10:30', endTime: '11:15', duration: 45 },
    { id: 5, startTime: '11:15', endTime: '12:00', duration: 45 },
    { id: 6, startTime: '13:00', endTime: '13:45', duration: 45 },
    { id: 7, startTime: '13:45', endTime: '14:30', duration: 45 },
    { id: 8, startTime: '14:30', endTime: '15:15', duration: 45 }
  ];

  subjects: Subject[] = [
    { id: 1, name: 'Mathematics', code: 'MATH', color: '#3b82f6' },
    { id: 2, name: 'English', code: 'ENG', color: '#10b981' },
    { id: 3, name: 'Science', code: 'SCI', color: '#f59e0b' },
    { id: 4, name: 'History', code: 'HIST', color: '#8b5cf6' },
    { id: 5, name: 'Geography', code: 'GEO', color: '#ef4444' }
  ];

  classRooms: ClassRoom[] = [
    { 
      id: 1, 
      name: 'Room 101', 
      capacity: 30, 
      type: 'classroom',
      equipment: ['Projector', 'Whiteboard', 'Computer']
    },
    { 
      id: 2, 
      name: 'Science Lab A', 
      capacity: 25, 
      type: 'lab',
      equipment: ['Microscopes', 'Lab Tables', 'Safety Equipment']
    },
    { 
      id: 3, 
      name: 'Computer Lab', 
      capacity: 20, 
      type: 'lab',
      equipment: ['30 Computers', 'Projector', 'Network']
    },
    { 
      id: 4, 
      name: 'Main Auditorium', 
      capacity: 200, 
      type: 'auditorium',
      equipment: ['Stage', 'Sound System', 'Lighting']
    }
  ];

  timetableEntries: TimetableEntry[] = [
    {
      id: 1,
      day: 'Monday',
      timeSlotId: 1,
      subjectId: 1,
      classId: 'Class 10-A',
      roomId: 1
    },
    {
      id: 2,
      day: 'Monday',
      timeSlotId: 2,
      subjectId: 2,
      classId: 'Class 9-B',
      roomId: 2
    },
    {
      id: 3,
      day: 'Tuesday',
      timeSlotId: 1,
      subjectId: 3,
      classId: 'Class 10-A',
      roomId: 2,
      isSubstitute: true,
      substituteTeacher: 'Dr. Smith'
    }
  ];

  substituteRequests = [
    {
      id: 1,
      originalTeacher: 'Ms. Johnson',
      reason: 'Medical appointment',
      date: new Date(),
      subject: 'Mathematics',
      class: 'Class 10-A',
      timeSlot: '08:00 - 08:45',
      status: 'pending',
      substituteTeacher: null
    },
    {
      id: 2,
      originalTeacher: 'Mr. Wilson',
      reason: 'Emergency leave',
      date: new Date(),
      subject: 'Science',
      class: 'Class 9-B',
      timeSlot: '09:30 - 10:15',
      status: 'assigned',
      substituteTeacher: 'Dr. Brown'
    }
  ];

  availableSubstitutes = [
    {
      id: 1,
      name: 'Dr. Robert Smith',
      subjects: ['Mathematics', 'Physics'],
      available: true,
      rating: 4.8,
      experience: 15,
      lastUsed: new Date('2025-09-15')
    },
    {
      id: 2,
      name: 'Ms. Sarah Brown',
      subjects: ['English', 'Literature'],
      available: false,
      rating: 4.6,
      experience: 8,
      lastUsed: new Date('2025-09-18')
    }
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getCurrentWeekStart() {
    return this.currentWeekStart;
  }

  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
  }

  getDayDate(day: string) {
    const dayIndex = this.weekDays.indexOf(day);
    const date = new Date(this.currentWeekStart);
    date.setDate(date.getDate() + dayIndex);
    return date;
  }

  hasClass(day: string, timeSlotId: number): boolean {
    return this.timetableEntries.some(entry => 
      entry.day === day && entry.timeSlotId === timeSlotId
    );
  }

  isSubstitute(day: string, timeSlotId: number): boolean {
    const entry = this.getClassEntry(day, timeSlotId);
    return entry?.isSubstitute || false;
  }

  getClassEntry(day: string, timeSlotId: number): TimetableEntry | undefined {
    return this.timetableEntries.find(entry => 
      entry.day === day && entry.timeSlotId === timeSlotId
    );
  }

  getSubjectName(subjectId: number): string {
    return this.subjects.find(s => s.id === subjectId)?.name || '';
  }

  getSubjectCode(subjectId: number): string {
    return this.subjects.find(s => s.id === subjectId)?.code || '';
  }

  getSubjectColor(subjectId: number): string {
    return this.subjects.find(s => s.id === subjectId)?.color || '#64748b';
  }

  getRoomName(roomId: number): string {
    return this.classRooms.find(r => r.id === roomId)?.name || '';
  }

  getRoomType(roomId: number): string {
    return this.classRooms.find(r => r.id === roomId)?.type || '';
  }

  getTimeSlot(timeSlotId: number): TimeSlot | undefined {
    return this.timeSlots.find(t => t.id === timeSlotId);
  }

  // Stats Methods
  getTotalClassesToday(): number {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return this.timetableEntries.filter(entry => entry.day === today).length;
  }

  getTotalHoursToday(): number {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayEntries = this.timetableEntries.filter(entry => entry.day === today);
    return todayEntries.reduce((total, entry) => {
      const slot = this.getTimeSlot(entry.timeSlotId);
      return total + (slot?.duration || 0);
    }, 0) / 60;
  }

  getFreePeriodsToday(): number {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = this.timetableEntries.filter(entry => entry.day === today).length;
    return this.timeSlots.length - todayClasses;
  }

  getSubstitutesToday(): number {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return this.timetableEntries.filter(entry => 
      entry.day === today && entry.isSubstitute
    ).length;
  }

  // Daily Schedule Methods
  loadDaySchedule() {
    console.log('Loading schedule for:', this.selectedDate);
  }

  getDayEntries(): TimetableEntry[] {
    const selectedDay = new Date(this.selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    return this.timetableEntries
      .filter(entry => entry.day === selectedDay)
      .sort((a, b) => a.timeSlotId - b.timeSlotId);
  }

  isCurrentClass(entry: TimetableEntry): boolean {
    const now = new Date();
    const timeSlot = this.getTimeSlot(entry.timeSlotId);
    if (!timeSlot) return false;
    
    const startTime = new Date();
    const [hours, minutes] = timeSlot.startTime.split(':').map(Number);
    startTime.setHours(hours, minutes, 0);
    
    const endTime = new Date();
    const [endHours, endMinutes] = timeSlot.endTime.split(':').map(Number);
    endTime.setHours(endHours, endMinutes, 0);
    
    return now >= startTime && now <= endTime;
  }

  isNextClass(entry: TimetableEntry): boolean {
    // Implementation for determining next class
    return false;
  }

  // Action Methods
  editClass(entry: TimetableEntry) {
    console.log('Editing class:', entry);
  }

  arrangeSubstitute(entry: TimetableEntry) {
    console.log('Arranging substitute for:', entry);
  }

  addClass(day: string, timeSlotId: number) {
    console.log('Adding class for:', day, timeSlotId);
  }

  addClassToDay() {
    console.log('Adding class to selected day');
  }

  markAttendance(entry: TimetableEntry) {
    console.log('Marking attendance for:', entry);
  }

  viewMaterials(entry: TimetableEntry) {
    console.log('Viewing materials for:', entry);
  }

  exportDaySchedule() {
    console.log('Exporting day schedule');
  }

  notifyChanges() {
    console.log('Notifying schedule changes');
  }

  printTimetable() {
    console.log('Printing timetable');
  }

  // Room Management Methods
  getFilteredRooms(): ClassRoom[] {
    if (this.roomFilter === 'all') return this.classRooms;
    return this.classRooms.filter(room => room.type === this.roomFilter);
  }

  getRoomBookings(roomId: number) {
    // Mock room bookings for today
    return [
      { time: '08:00', class: 'Class 10-A', subject: 'Mathematics' },
      { time: '09:30', class: 'Class 9-B', subject: 'Science' }
    ];
  }

  addNewRoom() {
    console.log('Adding new room');
  }

  viewRoomSchedule(roomId: number) {
    console.log('Viewing room schedule for:', roomId);
  }

  bookRoom(roomId: number) {
    console.log('Booking room:', roomId);
  }

  editRoom(room: ClassRoom) {
    console.log('Editing room:', room);
  }

  // Substitute Management Methods
  requestSubstitute() {
    console.log('Requesting substitute');
  }

  emergencySubstitute() {
    console.log('Emergency substitute request');
  }

  assignSubstitute(request: any) {
    console.log('Assigning substitute to request:', request);
  }

  contactSubstitute(request: any) {
    console.log('Contacting substitute for request:', request);
  }

  cancelRequest(requestId: number) {
    if (confirm('Are you sure you want to cancel this substitute request?')) {
      this.substituteRequests = this.substituteRequests.filter(r => r.id !== requestId);
    }
  }

  quickAssign(substitute: any) {
    console.log('Quick assigning substitute:', substitute);
  }

  contactTeacher(substitute: any) {
    console.log('Contacting teacher:', substitute);
  }

  viewProfile(substitute: any) {
    console.log('Viewing profile:', substitute);
  }
}