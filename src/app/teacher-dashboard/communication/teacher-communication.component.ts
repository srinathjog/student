import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  type: 'sent' | 'received';
  subject: string;
  content: string;
  recipient?: string;
  sender?: string;
  date: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
}

interface Meeting {
  id: number;
  parentName: string;
  studentName: string;
  date: Date;
  time: string;
  duration: number;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  targetAudience: 'all' | 'class' | 'parents';
  class?: string;
  priority: 'low' | 'medium' | 'high';
  publishDate: Date;
  expiryDate?: Date;
  published: boolean;
}

@Component({
  selector: 'app-teacher-communication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="communication-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">💬 Communication Hub</h1>
        <p class="page-subtitle">Stay connected with parents and manage all communications</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card unread">
          <div class="stat-icon">📧</div>
          <div class="stat-content">
            <div class="stat-number">{{ getUnreadCount() }}</div>
            <div class="stat-label">Unread Messages</div>
          </div>
        </div>
        <div class="stat-card meetings">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-number">{{ getUpcomingMeetings() }}</div>
            <div class="stat-label">Upcoming Meetings</div>
          </div>
        </div>
        <div class="stat-card announcements">
          <div class="stat-icon">📢</div>
          <div class="stat-content">
            <div class="stat-number">{{ getActiveAnnouncements() }}</div>
            <div class="stat-label">Active Announcements</div>
          </div>
        </div>
        <div class="stat-card responses">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <div class="stat-number">{{ getTodayResponses() }}</div>
            <div class="stat-label">Today's Responses</div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-container">
        <button class="tab-btn" [class.active]="activeTab === 'messages'" (click)="setActiveTab('messages')">
          📧 Messages
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'meetings'" (click)="setActiveTab('meetings')">
          📅 Meetings
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'announcements'" (click)="setActiveTab('announcements')">
          📢 Announcements
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'compose'" (click)="setActiveTab('compose')">
          ✍️ Compose
        </button>
      </div>

      <!-- Messages Tab -->
      <div class="tab-content" *ngIf="activeTab === 'messages'">
        <div class="messages-header">
          <div class="filter-controls">
            <select [(ngModel)]="messageFilter" (change)="filterMessages()">
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
            </select>
            <select [(ngModel)]="priorityFilter" (change)="filterMessages()">
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <button class="compose-btn" (click)="setActiveTab('compose')">
            ➕ New Message
          </button>
        </div>

        <div class="messages-list">
          <div *ngFor="let message of filteredMessages" class="message-card" 
               [class.unread]="!message.read" [class]="message.priority">
            <div class="message-header">
              <div class="message-info">
                <div class="message-subject">{{ message.subject }}</div>
                <div class="message-sender">
                  <span *ngIf="message.type === 'received'">From: {{ message.sender }}</span>
                  <span *ngIf="message.type === 'sent'">To: {{ message.recipient }}</span>
                </div>
              </div>
              <div class="message-meta">
                <div class="message-date">{{ message.date | date:'MMM dd, HH:mm' }}</div>
                <div class="message-priority" [class]="message.priority">
                  <span *ngIf="message.priority === 'high'">🔴</span>
                  <span *ngIf="message.priority === 'medium'">🟡</span>
                  <span *ngIf="message.priority === 'low'">🟢</span>
                </div>
                <div class="message-type">
                  <span *ngIf="message.type === 'sent'">📤</span>
                  <span *ngIf="message.type === 'received'">📥</span>
                </div>
              </div>
            </div>
            <div class="message-content">{{ message.content }}</div>
            <div class="message-attachments" *ngIf="message.attachments && message.attachments.length > 0">
              <span class="attachment-icon">📎</span>
              <span class="attachment-count">{{ message.attachments.length }} attachment(s)</span>
            </div>
            <div class="message-actions">
              <button class="action-btn reply" (click)="replyMessage(message)">↩️ Reply</button>
              <button class="action-btn forward" (click)="forwardMessage(message)">↗️ Forward</button>
              <button class="action-btn mark-read" (click)="markAsRead(message)" *ngIf="!message.read">
                ✅ Mark as Read
              </button>
              <button class="action-btn delete" (click)="deleteMessage(message.id)">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Meetings Tab -->
      <div class="tab-content" *ngIf="activeTab === 'meetings'">
        <div class="meetings-header">
          <button class="schedule-btn" (click)="showScheduleMeeting = true">
            ➕ Schedule Meeting
          </button>
          <div class="meeting-filters">
            <select [(ngModel)]="meetingFilter">
              <option value="all">All Meetings</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="meetings-grid">
          <div *ngFor="let meeting of getFilteredMeetings()" class="meeting-card" [class]="meeting.status">
            <div class="meeting-header">
              <div class="meeting-title">
                <strong>{{ meeting.parentName }}</strong>
                <span class="student-name">for {{ meeting.studentName }}</span>
              </div>
              <div class="meeting-status" [class]="meeting.status">
                <span *ngIf="meeting.status === 'scheduled'">📅</span>
                <span *ngIf="meeting.status === 'completed'">✅</span>
                <span *ngIf="meeting.status === 'cancelled'">❌</span>
                {{ meeting.status | titlecase }}
              </div>
            </div>

            <div class="meeting-details">
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{ meeting.date | date:'MMM dd, yyyy' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">{{ meeting.time }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ meeting.duration }} minutes</span>
              </div>
              <div class="detail-row">
                <span class="label">Purpose:</span>
                <span class="value">{{ meeting.purpose }}</span>
              </div>
            </div>

            <div class="meeting-notes" *ngIf="meeting.notes">
              <strong>Notes:</strong> {{ meeting.notes }}
            </div>

            <div class="meeting-actions">
              <button class="action-btn edit" (click)="editMeeting(meeting)" *ngIf="meeting.status === 'scheduled'">
                ✏️ Edit
              </button>
              <button class="action-btn complete" (click)="completeMeeting(meeting)" *ngIf="meeting.status === 'scheduled'">
                ✅ Complete
              </button>
              <button class="action-btn cancel" (click)="cancelMeeting(meeting)" *ngIf="meeting.status === 'scheduled'">
                ❌ Cancel
              </button>
              <button class="action-btn notes" (click)="addNotes(meeting)">
                📝 Add Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements Tab -->
      <div class="tab-content" *ngIf="activeTab === 'announcements'">
        <div class="announcements-header">
          <button class="create-btn" (click)="showCreateAnnouncement = true">
            ➕ Create Announcement
          </button>
          <div class="announcement-filters">
            <select [(ngModel)]="announcementFilter">
              <option value="all">All Announcements</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div class="announcements-grid">
          <div *ngFor="let announcement of getFilteredAnnouncements()" class="announcement-card" [class]="announcement.priority">
            <div class="announcement-header">
              <div class="announcement-title">{{ announcement.title }}</div>
              <div class="announcement-status">
                <span *ngIf="announcement.published" class="published">🟢 Published</span>
                <span *ngIf="!announcement.published" class="draft">🟡 Draft</span>
              </div>
            </div>

            <div class="announcement-meta">
              <div class="meta-item">
                <span class="label">Target:</span>
                <span class="value">{{ announcement.targetAudience | titlecase }}</span>
                <span *ngIf="announcement.class" class="class-info">{{ announcement.class }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Priority:</span>
                <span class="value priority" [class]="announcement.priority">
                  <span *ngIf="announcement.priority === 'high'">🔴 High</span>
                  <span *ngIf="announcement.priority === 'medium'">🟡 Medium</span>
                  <span *ngIf="announcement.priority === 'low'">🟢 Low</span>
                </span>
              </div>
              <div class="meta-item">
                <span class="label">Published:</span>
                <span class="value">{{ announcement.publishDate | date:'MMM dd, yyyy' }}</span>
              </div>
              <div class="meta-item" *ngIf="announcement.expiryDate">
                <span class="label">Expires:</span>
                <span class="value">{{ announcement.expiryDate | date:'MMM dd, yyyy' }}</span>
              </div>
            </div>

            <div class="announcement-content">{{ announcement.content }}</div>

            <div class="announcement-actions">
              <button class="action-btn edit" (click)="editAnnouncement(announcement)">
                ✏️ Edit
              </button>
              <button class="action-btn publish" (click)="publishAnnouncement(announcement)" *ngIf="!announcement.published">
                📢 Publish
              </button>
              <button class="action-btn unpublish" (click)="unpublishAnnouncement(announcement)" *ngIf="announcement.published">
                🔇 Unpublish
              </button>
              <button class="action-btn delete" (click)="deleteAnnouncement(announcement.id)">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Compose Tab -->
      <div class="tab-content" *ngIf="activeTab === 'compose'">
        <div class="compose-form">
          <h3>✍️ Compose New Message</h3>
          <form (ngSubmit)="sendMessage()" #messageForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>Message Type *</label>
                <select [(ngModel)]="newMessage.type" name="messageType" required>
                  <option value="">Select Type</option>
                  <option value="individual">Individual Parent</option>
                  <option value="class">Entire Class</option>
                  <option value="multiple">Multiple Parents</option>
                </select>
              </div>
              <div class="form-group">
                <label>Priority *</label>
                <select [(ngModel)]="newMessage.priority" name="priority" required>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            <div class="form-group" *ngIf="newMessage.type === 'individual'">
              <label>Select Parent *</label>
              <select [(ngModel)]="newMessage.recipient" name="recipient" required>
                <option value="">Choose Parent</option>
                <option value="john.smith@parent.com">John Smith (Parent of Alice Smith)</option>
                <option value="mary.johnson@parent.com">Mary Johnson (Parent of Bob Johnson)</option>
                <option value="robert.wilson@parent.com">Robert Wilson (Parent of Carol Wilson)</option>
              </select>
            </div>

            <div class="form-group" *ngIf="newMessage.type === 'class'">
              <label>Select Class *</label>
              <select [(ngModel)]="newMessage.class" name="class" required>
                <option value="">Choose Class</option>
                <option value="Class 10-A">Class 10-A</option>
                <option value="Class 9-B">Class 9-B</option>
                <option value="Class 8-C">Class 8-C</option>
              </select>
            </div>

            <div class="form-group">
              <label>Subject *</label>
              <input type="text" [(ngModel)]="newMessage.subject" name="subject" 
                     placeholder="Enter message subject" required>
            </div>

            <div class="form-group">
              <label>Message Content *</label>
              <textarea [(ngModel)]="newMessage.content" name="content" rows="6" 
                        placeholder="Type your message here..." required></textarea>
            </div>

            <div class="form-group">
              <label>Attachments</label>
              <input type="file" multiple (change)="handleFileUpload($event)">
              <div class="file-list" *ngIf="newMessage.attachments.length > 0">
                <div *ngFor="let file of newMessage.attachments" class="file-item">
                  📎 {{ file }}
                  <button type="button" (click)="removeAttachment(file)">✕</button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="resetMessageForm()">Cancel</button>
              <button type="button" class="draft-btn" (click)="saveDraft()">Save Draft</button>
              <button type="submit" class="send-btn" [disabled]="!messageForm.valid">Send Message</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Schedule Meeting Modal -->
      <div class="modal-overlay" *ngIf="showScheduleMeeting" (click)="showScheduleMeeting = false">
        <div class="meeting-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Schedule Parent-Teacher Meeting</h3>
            <button class="close-btn" (click)="showScheduleMeeting = false">✕</button>
          </div>
          
          <form (ngSubmit)="scheduleMeeting()" #meetingForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>Parent Name *</label>
                <input type="text" [(ngModel)]="newMeeting.parentName" name="parentName" required>
              </div>
              <div class="form-group">
                <label>Student Name *</label>
                <input type="text" [(ngModel)]="newMeeting.studentName" name="studentName" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date *</label>
                <input type="date" [(ngModel)]="newMeeting.date" name="date" required>
              </div>
              <div class="form-group">
                <label>Time *</label>
                <input type="time" [(ngModel)]="newMeeting.time" name="time" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Duration (minutes) *</label>
                <select [(ngModel)]="newMeeting.duration" name="duration" required>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
              <div class="form-group">
                <label>Purpose *</label>
                <select [(ngModel)]="newMeeting.purpose" name="purpose" required>
                  <option value="">Select Purpose</option>
                  <option value="Academic Progress">Academic Progress</option>
                  <option value="Behavioral Discussion">Behavioral Discussion</option>
                  <option value="Parent Concern">Parent Concern</option>
                  <option value="General Discussion">General Discussion</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="showScheduleMeeting = false">Cancel</button>
              <button type="submit" class="schedule-btn" [disabled]="!meetingForm.valid">Schedule Meeting</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .communication-container {
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
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
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

    .stat-card.unread { border-left-color: #ef4444; }
    .stat-card.meetings { border-left-color: #3b82f6; }
    .stat-card.announcements { border-left-color: #10b981; }
    .stat-card.responses { border-left-color: #8b5cf6; }

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

    /* Messages */
    .messages-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
    }

    .filter-controls select {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
    }

    .compose-btn,
    .schedule-btn,
    .create-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .message-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 1rem;
      border-left: 4px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .message-card.unread {
      background: #f0f9ff;
      border-left-color: #3b82f6;
    }

    .message-card.high { border-left-color: #ef4444; }
    .message-card.medium { border-left-color: #f59e0b; }
    .message-card.low { border-left-color: #10b981; }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .message-subject {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .message-sender {
      font-size: 0.9rem;
      color: #64748b;
    }

    .message-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .message-date {
      font-size: 0.8rem;
      color: #64748b;
    }

    .message-priority,
    .message-type {
      font-size: 1rem;
    }

    .message-content {
      color: #374151;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .message-attachments {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #64748b;
    }

    .message-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn.reply { background: #f0f9ff; color: #1e40af; }
    .action-btn.forward { background: #f0fdf4; color: #166534; }
    .action-btn.mark-read { background: #fef3c7; color: #92400e; }
    .action-btn.delete { background: #fef2f2; color: #dc2626; }
    .action-btn.edit { background: #f3f4f6; color: #374151; }
    .action-btn.complete { background: #f0fdf4; color: #166534; }
    .action-btn.cancel { background: #fef2f2; color: #dc2626; }
    .action-btn.notes { background: #f5f3ff; color: #7c3aed; }
    .action-btn.publish { background: #f0fdf4; color: #166534; }
    .action-btn.unpublish { background: #fef3c7; color: #92400e; }

    /* Meetings */
    .meetings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .meetings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .meeting-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid;
      transition: transform 0.3s ease;
    }

    .meeting-card:hover {
      transform: translateY(-2px);
    }

    .meeting-card.scheduled { border-left-color: #3b82f6; }
    .meeting-card.completed { border-left-color: #10b981; }
    .meeting-card.cancelled { border-left-color: #ef4444; }

    .meeting-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .meeting-title {
      font-weight: 600;
      color: #1e293b;
    }

    .student-name {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: normal;
    }

    .meeting-status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .meeting-status.scheduled { background: #dbeafe; color: #1e40af; }
    .meeting-status.completed { background: #dcfce7; color: #166534; }
    .meeting-status.cancelled { background: #fee2e2; color: #dc2626; }

    .meeting-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .label {
      color: #64748b;
      font-weight: 500;
    }

    .value {
      color: #1e293b;
      font-weight: 600;
    }

    .meeting-notes {
      background: #f0f9ff;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #374151;
    }

    .meeting-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Announcements */
    .announcements-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .announcements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .announcement-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid;
      transition: transform 0.3s ease;
    }

    .announcement-card:hover {
      transform: translateY(-2px);
    }

    .announcement-card.high { border-left-color: #ef4444; }
    .announcement-card.medium { border-left-color: #f59e0b; }
    .announcement-card.low { border-left-color: #10b981; }

    .announcement-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .announcement-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      flex: 1;
    }

    .announcement-status {
      font-size: 0.8rem;
      font-weight: 600;
    }

    .published { color: #166534; }
    .draft { color: #92400e; }

    .announcement-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .class-info {
      font-weight: 600;
      color: #3b82f6;
    }

    .announcement-content {
      color: #374151;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .announcement-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Compose Form */
    .compose-form {
      max-width: 800px;
    }

    .compose-form h3 {
      margin-bottom: 2rem;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .file-list {
      margin-top: 0.5rem;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: #f0f9ff;
      border-radius: 6px;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    .file-item button {
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 0.7rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .cancel-btn,
    .draft-btn,
    .send-btn,
    .schedule-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-btn { background: #f1f5f9; color: #64748b; }
    .draft-btn { background: #fbbf24; color: white; }
    .send-btn { background: #3b82f6; color: white; }
    .schedule-btn { background: #10b981; color: white; }

    .send-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .meeting-modal {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .modal-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .meetings-grid,
      .announcements-grid {
        grid-template-columns: 1fr;
      }

      .tabs-container {
        flex-wrap: wrap;
      }

      .tab-btn {
        flex: 1;
        min-width: 120px;
      }
    }
  `]
})
export class TeacherCommunicationComponent {
  activeTab = 'messages';
  messageFilter = 'all';
  priorityFilter = '';
  meetingFilter = 'all';
  announcementFilter = 'all';
  showScheduleMeeting = false;
  showCreateAnnouncement = false;

  newMessage = {
    type: '',
    recipient: '',
    class: '',
    subject: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    attachments: [] as string[]
  };

  newMeeting = {
    parentName: '',
    studentName: '',
    date: '',
    time: '',
    duration: 30,
    purpose: ''
  };

  messages: Message[] = [
    {
      id: 1,
      type: 'received',
      subject: 'Concern about homework load',
      content: 'Dear Ms. Johnson, I wanted to discuss the recent increase in homework assignments for my daughter Sarah. She\'s struggling to complete everything on time.',
      sender: 'Mary Smith (Sarah\'s Parent)',
      date: new Date('2025-09-21T10:30:00'),
      read: false,
      priority: 'medium',
      attachments: []
    },
    {
      id: 2,
      type: 'sent',
      subject: 'Great progress in Mathematics',
      content: 'Hello Mr. Wilson, I wanted to share some positive feedback about John\'s recent performance in mathematics. He has shown significant improvement.',
      recipient: 'Robert Wilson (John\'s Parent)',
      date: new Date('2025-09-20T14:15:00'),
      read: true,
      priority: 'low',
      attachments: ['progress_report.pdf']
    },
    {
      id: 3,
      type: 'received',
      subject: 'Request for parent-teacher meeting',
      content: 'Hi Ms. Johnson, we would like to schedule a meeting to discuss Emma\'s academic progress and behavior in class.',
      sender: 'Lisa Brown (Emma\'s Parent)',
      date: new Date('2025-09-22T09:00:00'),
      read: false,
      priority: 'high',
      attachments: []
    }
  ];

  meetings: Meeting[] = [
    {
      id: 1,
      parentName: 'John Smith',
      studentName: 'Alice Smith',
      date: new Date('2025-09-25'),
      time: '14:00',
      duration: 30,
      purpose: 'Academic Progress',
      status: 'scheduled'
    },
    {
      id: 2,
      parentName: 'Mary Johnson',
      studentName: 'Bob Johnson',
      date: new Date('2025-09-20'),
      time: '15:30',
      duration: 45,
      purpose: 'Behavioral Discussion',
      status: 'completed',
      notes: 'Discussed strategies to improve focus in class. Parent agreed to implement home study schedule.'
    }
  ];

  announcements: Announcement[] = [
    {
      id: 1,
      title: 'Mathematics Quiz Next Week',
      content: 'There will be a mathematics quiz covering chapters 4-6 next Friday. Students should review all practice problems.',
      targetAudience: 'class',
      class: 'Class 10-A',
      priority: 'medium',
      publishDate: new Date('2025-09-22'),
      expiryDate: new Date('2025-09-27'),
      published: true
    },
    {
      id: 2,
      title: 'Parent-Teacher Conference Schedule',
      content: 'Parent-teacher conferences will be held on October 15th. Please sign up for your preferred time slot.',
      targetAudience: 'all',
      priority: 'high',
      publishDate: new Date('2025-09-21'),
      published: false
    }
  ];

  get filteredMessages() {
    return this.messages.filter(message => {
      const typeMatch = this.messageFilter === 'all' || 
                       (this.messageFilter === 'unread' && !message.read) ||
                       (this.messageFilter === 'sent' && message.type === 'sent') ||
                       (this.messageFilter === 'received' && message.type === 'received');
      
      const priorityMatch = !this.priorityFilter || message.priority === this.priorityFilter;
      
      return typeMatch && priorityMatch;
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  filterMessages() {
    // Filtering is handled by the getter
  }

  getUnreadCount(): number {
    return this.messages.filter(m => !m.read && m.type === 'received').length;
  }

  getUpcomingMeetings(): number {
    const today = new Date();
    return this.meetings.filter(m => m.status === 'scheduled' && new Date(m.date) >= today).length;
  }

  getActiveAnnouncements(): number {
    return this.announcements.filter(a => a.published).length;
  }

  getTodayResponses(): number {
    const today = new Date().toDateString();
    return this.messages.filter(m => m.date.toDateString() === today).length;
  }

  getFilteredMeetings() {
    if (this.meetingFilter === 'all') return this.meetings;
    return this.meetings.filter(m => m.status === this.meetingFilter);
  }

  getFilteredAnnouncements() {
    if (this.announcementFilter === 'all') return this.announcements;
    if (this.announcementFilter === 'published') return this.announcements.filter(a => a.published);
    if (this.announcementFilter === 'draft') return this.announcements.filter(a => !a.published);
    if (this.announcementFilter === 'expired') {
      const today = new Date();
      return this.announcements.filter(a => a.expiryDate && new Date(a.expiryDate) < today);
    }
    return this.announcements;
  }

  // Message Actions
  replyMessage(message: Message) {
    this.newMessage = {
      type: 'individual',
      recipient: message.sender || '',
      class: '',
      subject: 'Re: ' + message.subject,
      content: '',
      priority: 'medium',
      attachments: []
    };
    this.setActiveTab('compose');
  }

  forwardMessage(message: Message) {
    console.log('Forward message:', message);
  }

  markAsRead(message: Message) {
    message.read = true;
  }

  deleteMessage(id: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messages = this.messages.filter(m => m.id !== id);
    }
  }

  sendMessage() {
    const message: Message = {
      id: Date.now(),
      type: 'sent',
      subject: this.newMessage.subject,
      content: this.newMessage.content,
      recipient: this.newMessage.recipient,
      date: new Date(),
      read: true,
      priority: this.newMessage.priority,
      attachments: this.newMessage.attachments
    };

    this.messages.unshift(message);
    this.resetMessageForm();
    this.setActiveTab('messages');
  }

  saveDraft() {
    console.log('Save message as draft:', this.newMessage);
  }

  resetMessageForm() {
    this.newMessage = {
      type: '',
      recipient: '',
      class: '',
      subject: '',
      content: '',
      priority: 'medium',
      attachments: []
    };
  }

  handleFileUpload(event: any) {
    const files = Array.from(event.target.files) as File[];
    files.forEach(file => {
      this.newMessage.attachments.push(file.name);
    });
  }

  removeAttachment(fileName: string) {
    this.newMessage.attachments = this.newMessage.attachments.filter(f => f !== fileName);
  }

  // Meeting Actions
  scheduleMeeting() {
    const meeting: Meeting = {
      id: Date.now(),
      parentName: this.newMeeting.parentName,
      studentName: this.newMeeting.studentName,
      date: new Date(this.newMeeting.date),
      time: this.newMeeting.time,
      duration: this.newMeeting.duration,
      purpose: this.newMeeting.purpose,
      status: 'scheduled'
    };

    this.meetings.unshift(meeting);
    this.resetMeetingForm();
    this.showScheduleMeeting = false;
  }

  resetMeetingForm() {
    this.newMeeting = {
      parentName: '',
      studentName: '',
      date: '',
      time: '',
      duration: 30,
      purpose: ''
    };
  }

  editMeeting(meeting: Meeting) {
    console.log('Edit meeting:', meeting);
  }

  completeMeeting(meeting: Meeting) {
    meeting.status = 'completed';
  }

  cancelMeeting(meeting: Meeting) {
    if (confirm('Are you sure you want to cancel this meeting?')) {
      meeting.status = 'cancelled';
    }
  }

  addNotes(meeting: Meeting) {
    const notes = prompt('Add meeting notes:', meeting.notes || '');
    if (notes !== null) {
      meeting.notes = notes;
    }
  }

  // Announcement Actions
  editAnnouncement(announcement: Announcement) {
    console.log('Edit announcement:', announcement);
  }

  publishAnnouncement(announcement: Announcement) {
    announcement.published = true;
  }

  unpublishAnnouncement(announcement: Announcement) {
    announcement.published = false;
  }

  deleteAnnouncement(id: number) {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcements = this.announcements.filter(a => a.id !== id);
    }
  }
}