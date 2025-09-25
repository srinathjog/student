import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TeacherQualification {
  id: number;
  degree: string;
  institution: string;
  year: number;
  specialization?: string;
  grade?: string;
}

interface TeachingExperience {
  id: number;
  institution: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  subjects: string[];
  classes: string[];
  achievements?: string[];
}

interface Achievement {
  id: number;
  title: string;
  date: Date;
  type: 'award' | 'certification' | 'training' | 'recognition';
  description: string;
  issuer?: string;
}

interface TeacherSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    gradeUpdates: boolean;
    behaviorAlerts: boolean;
    parentMessages: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    allowParentContact: boolean;
    profileVisibility: 'public' | 'staff' | 'private';
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    gradeFormat: string;
    autoSave: boolean;
    darkMode: boolean;
  };
  communication: {
    responseTime: string;
    availableHours: {
      start: string;
      end: string;
    };
    preferredMethod: 'email' | 'phone' | 'message';
    officeHours: string;
  };
}

interface TeacherProfile {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  joinDate: Date;
  profileImage?: string;
  department: string;
  position: string;
  subjects: string[];
  classes: string[];
  qualifications: TeacherQualification[];
  experience: TeachingExperience[];
  achievements: Achievement[];
  bio: string;
  specializations: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  settings: TeacherSettings;
  statistics: {
    totalStudents: number;
    averageGrade: number;
    yearsExperience: number;
    classesTaught: number;
    parentSatisfaction: number;
  };
}

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">👨‍🏫 Teacher Profile & Settings</h1>
        <p class="page-subtitle">Manage your professional information, settings, and preferences • Stay connected with your teaching community</p>
        <div class="assignment-info">
          <span class="info-badge">📋 Employee ID: {{ teacherProfile.employeeId }}</span>
          <span class="info-badge">🏫 Department: {{ teacherProfile.department }}</span>
          <span class="info-badge">📚 Experience: {{ teacherProfile.statistics.yearsExperience }} years</span>
        </div>
      </div>

      <!-- Profile Overview Card -->
      <div class="profile-overview-card">
        <div class="profile-header">
          <div class="profile-image-section">
            <div class="profile-image">
              <img *ngIf="teacherProfile.profileImage" [src]="teacherProfile.profileImage" [alt]="getFullName()">
              <div *ngIf="!teacherProfile.profileImage" class="image-placeholder">
                {{ getInitials() }}
              </div>
              <button class="change-photo-btn" (click)="changeProfilePhoto()">
                📷 Change Photo
              </button>
            </div>
          </div>
          <div class="profile-info">
            <h2 class="teacher-name">{{ getFullName() }}</h2>
            <div class="teacher-details">
              <div class="detail-item">
                <span class="label">Employee ID:</span>
                <span class="value">{{ teacherProfile.employeeId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Department:</span>
                <span class="value">{{ teacherProfile.department }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Position:</span>
                <span class="value">{{ teacherProfile.position }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Join Date:</span>
                <span class="value">{{ teacherProfile.joinDate | date:'MMM dd, yyyy' }}</span>
              </div>
            </div>
          </div>
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-value">{{ teacherProfile.statistics.totalStudents }}</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ teacherProfile.statistics.averageGrade }}%</div>
              <div class="stat-label">Avg Grade</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ teacherProfile.statistics.yearsExperience }}</div>
              <div class="stat-label">Years Exp</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ teacherProfile.statistics.parentSatisfaction }}/5</div>
              <div class="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button class="tab-btn" [class.active]="activeTab === 'personal'" (click)="setActiveTab('personal')">
          👤 Personal Info
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'professional'" (click)="setActiveTab('professional')">
          🎓 Professional
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'settings'" (click)="setActiveTab('settings')">
          ⚙️ Settings
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'achievements'" (click)="setActiveTab('achievements')">
          🏆 Achievements
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Personal Information Tab -->
        <div *ngIf="activeTab === 'personal'" class="tab-panel">
          <div class="section-card">
            <h3 class="section-title">📋 Personal Information</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" [(ngModel)]="teacherProfile.firstName" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" [(ngModel)]="teacherProfile.lastName" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="teacherProfile.email" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" [(ngModel)]="teacherProfile.phone" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" [ngModel]="teacherProfile.dateOfBirth | date:'yyyy-MM-dd'" 
                       (ngModelChange)="updateDateOfBirth($event)" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Department</label>
                <select [(ngModel)]="teacherProfile.department" [disabled]="!editMode">
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📍 Address Information</h3>
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Street Address</label>
                <input type="text" [(ngModel)]="teacherProfile.address.street" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>City</label>
                <input type="text" [(ngModel)]="teacherProfile.address.city" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>State</label>
                <input type="text" [(ngModel)]="teacherProfile.address.state" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>ZIP Code</label>
                <input type="text" [(ngModel)]="teacherProfile.address.zipCode" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Country</label>
                <input type="text" [(ngModel)]="teacherProfile.address.country" [disabled]="!editMode">
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">🚨 Emergency Contact</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Contact Name</label>
                <input type="text" [(ngModel)]="teacherProfile.emergencyContact.name" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Relationship</label>
                <input type="text" [(ngModel)]="teacherProfile.emergencyContact.relationship" [disabled]="!editMode">
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" [(ngModel)]="teacherProfile.emergencyContact.phone" [disabled]="!editMode">
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📝 Bio & Specializations</h3>
            <div class="form-group full-width">
              <label>Professional Bio</label>
              <textarea [(ngModel)]="teacherProfile.bio" rows="4" [disabled]="!editMode"
                        placeholder="Tell us about your teaching philosophy, interests, and goals..."></textarea>
            </div>
            <div class="form-group full-width">
              <label>Specializations</label>
              <div class="specializations-tags">
                <span *ngFor="let spec of teacherProfile.specializations" class="spec-tag">
                  {{ spec }}
                  <button *ngIf="editMode" class="remove-tag" (click)="removeSpecialization(spec)">×</button>
                </span>
                <div *ngIf="editMode" class="add-specialization">
                  <input type="text" [(ngModel)]="newSpecialization" placeholder="Add specialization" 
                         (keyup.enter)="addSpecialization()">
                  <button (click)="addSpecialization()">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Information Tab -->
        <div *ngIf="activeTab === 'professional'" class="tab-panel">
          <div class="section-card">
            <h3 class="section-title">🎓 Qualifications</h3>
            <div class="qualifications-list">
              <div *ngFor="let qual of teacherProfile.qualifications" class="qualification-item">
                <div class="qual-header">
                  <div class="qual-degree">{{ qual.degree }}</div>
                  <div class="qual-year">{{ qual.year }}</div>
                </div>
                <div class="qual-details">
                  <div class="qual-institution">{{ qual.institution }}</div>
                  <div class="qual-specialization" *ngIf="qual.specialization">{{ qual.specialization }}</div>
                  <div class="qual-grade" *ngIf="qual.grade">Grade: {{ qual.grade }}</div>
                </div>
              </div>
              <button *ngIf="editMode" class="add-btn" (click)="addQualification()">+ Add Qualification</button>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">💼 Teaching Experience</h3>
            <div class="experience-timeline">
              <div *ngFor="let exp of teacherProfile.experience" class="experience-item">
                <div class="exp-timeline">
                  <div class="exp-period">
                    {{ exp.startDate | date:'MMM yyyy' }} - 
                    {{ exp.endDate ? (exp.endDate | date:'MMM yyyy') : 'Present' }}
                  </div>
                </div>
                <div class="exp-content">
                  <div class="exp-header">
                    <div class="exp-position">{{ exp.position }}</div>
                    <div class="exp-institution">{{ exp.institution }}</div>
                  </div>
                  <div class="exp-subjects">
                    <span class="label">Subjects:</span>
                    <span *ngFor="let subject of exp.subjects" class="subject-tag">{{ subject }}</span>
                  </div>
                  <div class="exp-classes">
                    <span class="label">Classes:</span>
                    <span *ngFor="let cls of exp.classes" class="class-tag">{{ cls }}</span>
                  </div>
                  <div class="exp-achievements" *ngIf="exp.achievements && exp.achievements.length > 0">
                    <span class="label">Key Achievements:</span>
                    <ul>
                      <li *ngFor="let achievement of exp.achievements">{{ achievement }}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button *ngIf="editMode" class="add-btn" (click)="addExperience()">+ Add Experience</button>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📚 Current Teaching Load</h3>
            <div class="teaching-load">
              <div class="load-section">
                <h4>Subjects</h4>
                <div class="load-tags">
                  <span *ngFor="let subject of teacherProfile.subjects" class="load-tag subject">{{ subject }}</span>
                </div>
              </div>
              <div class="load-section">
                <h4>Classes</h4>
                <div class="load-tags">
                  <span *ngFor="let cls of teacherProfile.classes" class="load-tag class">{{ cls }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div *ngIf="activeTab === 'settings'" class="tab-panel">
          <div class="section-card">
            <h3 class="section-title">🔔 Notification Preferences</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.notifications.email">
                  <span class="checkmark"></span>
                  Email Notifications
                </label>
                <p class="setting-description">Receive notifications via email</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.notifications.sms">
                  <span class="checkmark"></span>
                  SMS Notifications
                </label>
                <p class="setting-description">Receive important alerts via SMS</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.notifications.push">
                  <span class="checkmark"></span>
                  Push Notifications
                </label>
                <p class="setting-description">Browser and app push notifications</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.notifications.gradeUpdates">
                  <span class="checkmark"></span>
                  Grade Updates
                </label>
                <p class="setting-description">Notify when grades are submitted</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.notifications.behaviorAlerts">
                  <span class="checkmark"></span>
                  Behavior Alerts
                </label>
                <p class="setting-description">Alerts for student behavior issues</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.notifications.parentMessages">
                  <span class="checkmark"></span>
                  Parent Messages
                </label>
                <p class="setting-description">Notifications for parent communications</p>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">🔒 Privacy Settings</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.privacy.showEmail">
                  <span class="checkmark"></span>
                  Show Email to Parents
                </label>
                <p class="setting-description">Allow parents to see your email address</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.privacy.showPhone">
                  <span class="checkmark"></span>
                  Show Phone to Parents
                </label>
                <p class="setting-description">Allow parents to see your phone number</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.privacy.allowParentContact">
                  <span class="checkmark"></span>
                  Allow Direct Parent Contact
                </label>
                <p class="setting-description">Enable parents to contact you directly</p>
              </div>
              <div class="setting-item full-width">
                <label>Profile Visibility</label>
                <select [(ngModel)]="teacherProfile.settings.privacy.profileVisibility">
                  <option value="public">Public - Visible to all</option>
                  <option value="staff">Staff Only - Visible to school staff</option>
                  <option value="private">Private - Not visible</option>
                </select>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">⚙️ System Preferences</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <label>Language</label>
                <select [(ngModel)]="teacherProfile.settings.preferences.language">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div class="setting-item">
                <label>Timezone</label>
                <select [(ngModel)]="teacherProfile.settings.preferences.timezone">
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div class="setting-item">
                <label>Date Format</label>
                <select [(ngModel)]="teacherProfile.settings.preferences.dateFormat">
                  <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                  <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                  <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                </select>
              </div>
              <div class="setting-item">
                <label>Grade Format</label>
                <select [(ngModel)]="teacherProfile.settings.preferences.gradeFormat">
                  <option value="percentage">Percentage (0-100%)</option>
                  <option value="letter">Letter Grades (A-F)</option>
                  <option value="gpa">GPA Scale (0.0-4.0)</option>
                </select>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.preferences.autoSave">
                  <span class="checkmark"></span>
                  Auto-save Changes
                </label>
                <p class="setting-description">Automatically save form changes</p>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="teacherProfile.settings.preferences.darkMode">
                  <span class="checkmark"></span>
                  Dark Mode
                </label>
                <p class="setting-description">Use dark theme (coming soon)</p>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📞 Communication Settings</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <label>Response Time</label>
                <select [(ngModel)]="teacherProfile.settings.communication.responseTime">
                  <option value="immediate">Immediate (within 1 hour)</option>
                  <option value="same_day">Same Day (within 8 hours)</option>
                  <option value="next_day">Next Business Day</option>
                  <option value="48_hours">Within 48 hours</option>
                </select>
              </div>
              <div class="setting-item">
                <label>Preferred Contact Method</label>
                <select [(ngModel)]="teacherProfile.settings.communication.preferredMethod">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="message">In-App Message</option>
                </select>
              </div>
              <div class="setting-item">
                <label>Available Hours (Start)</label>
                <input type="time" [(ngModel)]="teacherProfile.settings.communication.availableHours.start">
              </div>
              <div class="setting-item">
                <label>Available Hours (End)</label>
                <input type="time" [(ngModel)]="teacherProfile.settings.communication.availableHours.end">
              </div>
              <div class="setting-item full-width">
                <label>Office Hours</label>
                <textarea [(ngModel)]="teacherProfile.settings.communication.officeHours" rows="3"
                          placeholder="Describe your office hours and availability for meetings..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements Tab -->
        <div *ngIf="activeTab === 'achievements'" class="tab-panel">
          <div class="section-card">
            <h3 class="section-title">🏆 Awards & Recognition</h3>
            <div class="achievements-grid">
              <div *ngFor="let achievement of getAchievementsByType('award')" class="achievement-card award">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-content">
                  <div class="achievement-title">{{ achievement.title }}</div>
                  <div class="achievement-date">{{ achievement.date | date:'MMM yyyy' }}</div>
                  <div class="achievement-description">{{ achievement.description }}</div>
                  <div class="achievement-issuer" *ngIf="achievement.issuer">{{ achievement.issuer }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📜 Certifications</h3>
            <div class="achievements-grid">
              <div *ngFor="let achievement of getAchievementsByType('certification')" class="achievement-card certification">
                <div class="achievement-icon">📜</div>
                <div class="achievement-content">
                  <div class="achievement-title">{{ achievement.title }}</div>
                  <div class="achievement-date">{{ achievement.date | date:'MMM yyyy' }}</div>
                  <div class="achievement-description">{{ achievement.description }}</div>
                  <div class="achievement-issuer" *ngIf="achievement.issuer">{{ achievement.issuer }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📚 Training & Development</h3>
            <div class="achievements-grid">
              <div *ngFor="let achievement of getAchievementsByType('training')" class="achievement-card training">
                <div class="achievement-icon">📚</div>
                <div class="achievement-content">
                  <div class="achievement-title">{{ achievement.title }}</div>
                  <div class="achievement-date">{{ achievement.date | date:'MMM yyyy' }}</div>
                  <div class="achievement-description">{{ achievement.description }}</div>
                  <div class="achievement-issuer" *ngIf="achievement.issuer">{{ achievement.issuer }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">⭐ Recognition</h3>
            <div class="achievements-grid">
              <div *ngFor="let achievement of getAchievementsByType('recognition')" class="achievement-card recognition">
                <div class="achievement-icon">⭐</div>
                <div class="achievement-content">
                  <div class="achievement-title">{{ achievement.title }}</div>
                  <div class="achievement-date">{{ achievement.date | date:'MMM yyyy' }}</div>
                  <div class="achievement-description">{{ achievement.description }}</div>
                  <div class="achievement-issuer" *ngIf="achievement.issuer">{{ achievement.issuer }}</div>
                </div>
              </div>
            </div>
          </div>

          <button *ngIf="editMode" class="add-btn primary" (click)="addAchievement()">
            + Add New Achievement
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button *ngIf="!editMode" class="action-btn primary" (click)="enableEditMode()">
          ✏️ Edit Profile
        </button>
        <button *ngIf="editMode" class="action-btn success" (click)="saveProfile()">
          💾 Save Changes
        </button>
        <button *ngIf="editMode" class="action-btn secondary" (click)="cancelEdit()">
          ❌ Cancel
        </button>
        <button class="action-btn secondary" (click)="exportProfile()">
          📥 Export Profile
        </button>
        <button class="action-btn secondary" (click)="changePassword()">
          🔒 Change Password
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .page-subtitle {
      color: #64748b;
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .assignment-info {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .info-badge {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }

    /* Profile Overview Card */
    .profile-overview-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .profile-header {
      padding: 2rem;
      display: flex;
      gap: 2rem;
      align-items: flex-start;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      flex-wrap: wrap;
    }

    .profile-image-section {
      flex-shrink: 0;
    }

    .profile-image {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      font-size: 2.5rem;
      font-weight: 700;
      color: #64748b;
    }

    .change-photo-btn {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .profile-info {
      flex: 1;
    }

    .teacher-name {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1rem;
    }

    .teacher-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .detail-item {
      display: flex;
      gap: 0.5rem;
    }

    .detail-item .label {
      font-weight: 600;
      color: #64748b;
      min-width: 100px;
    }

    .detail-item .value {
      color: #1e293b;
      font-weight: 500;
    }

    .profile-stats {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
    }

    .stat-item {
      text-align: center;
      padding: 0.875rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 75px;
      flex: 0 0 auto;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #3b82f6;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    /* Tab Navigation */
    .tab-navigation {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      padding: 0.5rem;
      display: flex;
      gap: 0.5rem;
    }

    .tab-btn {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: #64748b;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      background: #3b82f6;
      color: white;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .tab-btn:hover:not(.active) {
      background: #f1f5f9;
    }

    /* Tab Content */
    .tab-content {
      margin-bottom: 2rem;
    }

    .tab-panel {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .section-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 2rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #f1f5f9;
    }

    /* Form Styles */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
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

    .form-group input:disabled,
    .form-group select:disabled,
    .form-group textarea:disabled {
      background: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }

    /* Specializations */
    .specializations-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .spec-tag {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .remove-tag {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-weight: bold;
    }

    .add-specialization {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .add-specialization input {
      min-width: 150px;
    }

    .add-specialization button {
      padding: 0.5rem 1rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Qualifications */
    .qualifications-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .qualification-item {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
    }

    .qual-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .qual-degree {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .qual-year {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .qual-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .qual-institution {
      color: #64748b;
      font-weight: 500;
    }

    .qual-specialization,
    .qual-grade {
      color: #374151;
      font-size: 0.9rem;
    }

    /* Experience Timeline */
    .experience-timeline {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .experience-item {
      display: flex;
      gap: 2rem;
      position: relative;
    }

    .experience-item::before {
      content: '';
      position: absolute;
      left: 100px;
      top: 0;
      bottom: -2rem;
      width: 2px;
      background: #e5e7eb;
    }

    .experience-item:last-child::before {
      display: none;
    }

    .exp-timeline {
      min-width: 120px;
      text-align: right;
      position: relative;
    }

    .exp-timeline::after {
      content: '';
      position: absolute;
      right: -11px;
      top: 0.25rem;
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #3b82f6;
    }

    .exp-period {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.5rem;
      border-radius: 8px;
    }

    .exp-content {
      flex: 1;
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid #10b981;
    }

    .exp-header {
      margin-bottom: 1rem;
    }

    .exp-position {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .exp-institution {
      color: #64748b;
      font-weight: 500;
    }

    .exp-subjects,
    .exp-classes {
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .exp-subjects .label,
    .exp-classes .label {
      font-weight: 600;
      color: #374151;
      min-width: 60px;
    }

    .subject-tag,
    .class-tag {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .class-tag {
      background: #dcfce7;
      color: #166534;
    }

    .exp-achievements {
      margin-top: 1rem;
    }

    .exp-achievements .label {
      font-weight: 600;
      color: #374151;
      display: block;
      margin-bottom: 0.5rem;
    }

    .exp-achievements ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .exp-achievements li {
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    /* Teaching Load */
    .teaching-load {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    .load-section h4 {
      margin-bottom: 1rem;
      color: #374151;
      font-weight: 600;
    }

    .load-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .load-tag {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .load-tag.subject {
      background: #dbeafe;
      color: #1e40af;
    }

    .load-tag.class {
      background: #dcfce7;
      color: #166534;
    }

    /* Settings */
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .setting-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .setting-item.full-width {
      grid-column: 1 / -1;
    }

    .setting-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-weight: 600;
      color: #374151;
    }

    .setting-label input[type="checkbox"] {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      background: #e5e7eb;
      border-radius: 4px;
      position: relative;
      transition: all 0.3s ease;
    }

    .setting-label input[type="checkbox"]:checked + .checkmark {
      background: #3b82f6;
    }

    .setting-label input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      color: white;
      font-size: 14px;
      font-weight: bold;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .setting-description {
      color: #64748b;
      font-size: 0.8rem;
      margin: 0;
    }

    /* Achievements */
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .achievement-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .achievement-card.award { border-left-color: #fbbf24; }
    .achievement-card.certification { border-left-color: #3b82f6; }
    .achievement-card.training { border-left-color: #10b981; }
    .achievement-card.recognition { border-left-color: #8b5cf6; }

    .achievement-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .achievement-title {
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .achievement-date {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .achievement-description {
      color: #374151;
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 0.5rem;
    }

    .achievement-issuer {
      color: #64748b;
      font-size: 0.8rem;
      font-style: italic;
    }

    /* Buttons */
    .add-btn {
      padding: 1rem 2rem;
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      background: transparent;
      color: #6b7280;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }

    .add-btn:hover {
      border-color: #3b82f6;
      color: #3b82f6;
      background: #f8fafc;
    }

    .add-btn.primary {
      border: none;
      background: #3b82f6;
      color: white;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .action-btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 150px;
    }

    .action-btn.primary {
      background: #3b82f6;
      color: white;
    }

    .action-btn.success {
      background: #10b981;
      color: white;
    }

    .action-btn.secondary {
      background: #f1f5f9;
      color: #374151;
      border: 2px solid #e5e7eb;
    }

    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .profile-container {
        padding: 1rem;
      }
      
      .profile-header {
        gap: 1.5rem;
      }
      
      .profile-stats {
        gap: 0.75rem;
        justify-content: center;
      }
      
      .stat-item {
        padding: 0.75rem;
        min-width: 70px;
      }
    }
    
    @media (max-width: 768px) {
      .profile-container {
        padding: 0.75rem;
      }

      .assignment-info {
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }
      
      .profile-header {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
        gap: 1.5rem;
      }

      .profile-stats {
        justify-content: center;
        gap: 0.5rem;
      }
      
      .stat-item {
        padding: 0.5rem;
        min-width: 65px;
      }

      .teacher-details {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .tab-navigation {
        flex-wrap: wrap;
      }

      .tab-btn {
        min-width: 150px;
      }

      .teaching-load {
        grid-template-columns: 1fr;
      }

      .settings-grid {
        grid-template-columns: 1fr;
      }

      .achievements-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .experience-item {
        flex-direction: column;
        gap: 1rem;
      }

      .experience-item::before {
        display: none;
      }

      .exp-timeline::after {
        display: none;
      }

      .exp-timeline {
        text-align: left;
      }
    }
  `]
})
export class TeacherProfileComponent {
  activeTab: 'personal' | 'professional' | 'settings' | 'achievements' = 'personal';
  editMode = false;
  newSpecialization = '';

  teacherProfile: TeacherProfile = {
    id: 1,
    employeeId: 'TCH001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@delhipublicschool.edu.in',
    phone: '+91-9876543210',
    dateOfBirth: new Date('1985-07-15'),
    joinDate: new Date('2015-06-01'),
    profileImage: '',
    department: 'Mathematics',
    position: 'Senior Mathematics Teacher & Department Head',
    subjects: ['Advanced Mathematics', 'Calculus', 'Statistics', 'Algebra', 'Trigonometry'],
    classes: ['Class 10A', 'Class 9A', 'Class 8B'],
    bio: 'Dedicated mathematics educator with over 9 years of experience in the Indian education system. Specialized in making complex mathematical concepts accessible through innovative teaching methods. Committed to preparing students for competitive exams like JEE and NEET while fostering analytical thinking and problem-solving skills.',
    specializations: ['JEE Mathematics Preparation', 'CBSE Curriculum', 'Vedic Mathematics', 'Competitive Exam Coaching'],
    qualifications: [
      {
        id: 1,
        degree: 'Master of Education (M.Ed) in Mathematics',
        institution: 'Jamia Millia Islamia, New Delhi',
        year: 2014,
        specialization: 'Secondary Mathematics Education',
        grade: 'First Class with Distinction'
      },
      {
        id: 2,
        degree: 'Bachelor of Science (Honors) in Mathematics',
        institution: 'Delhi University, Miranda House',
        year: 2012,
        specialization: 'Pure Mathematics',
        grade: 'First Class'
      },
      {
        id: 3,
        degree: 'Bachelor of Education (B.Ed)',
        institution: 'IGNOU, New Delhi',
        year: 2013,
        specialization: 'Secondary Education - Mathematics'
      }
    ],
    experience: [
      {
        id: 1,
        institution: 'Delhi Public School, Rohini',
        position: 'Senior Mathematics Teacher & Department Head',
        startDate: new Date('2015-06-01'),
        subjects: ['Advanced Mathematics', 'Calculus', 'Statistics', 'Trigonometry'],
        classes: ['Class 10A', 'Class 9A', 'Class 8B'],
        achievements: [
          'Improved Class 10 CBSE Mathematics board exam results by 30%',
          'Successfully coached 50+ students for JEE Main Mathematics',
          'Implemented digital learning tools and smart classroom technology',
          'Led Mathematics Olympiad training program with 15 national qualifiers',
          'Mentored 8 junior teachers in CBSE curriculum and teaching methodologies'
        ]
      },
      {
        id: 2,
        institution: 'Ryan International School, Dwarka',
        position: 'Mathematics Teacher',
        startDate: new Date('2013-07-01'),
        endDate: new Date('2015-05-31'),
        subjects: ['Mathematics', 'Algebra', 'Geometry'],
        classes: ['Class 8A', 'Class 8B', 'Class 9A'],
        achievements: [
          'Introduced Vedic Mathematics techniques to enhance calculation speed',
          'Organized school-wide mathematics competition',
          'Achieved 95% student satisfaction rating'
        ]
      }
    ],
    achievements: [
      {
        id: 1,
        title: 'Best Mathematics Teacher Award',
        date: new Date('2023-09-05'),
        type: 'award',
        description: 'Recognized for outstanding contribution to student achievement in CBSE Board examinations and JEE preparation',
        issuer: 'Delhi Public School, Rohini'
      },
      {
        id: 2,
        title: 'CBSE Mathematics Teacher Training Certification',
        date: new Date('2022-12-15'),
        type: 'certification',
        description: 'Completed advanced certification in CBSE curriculum implementation and assessment methodologies',
        issuer: 'Central Board of Secondary Education (CBSE)'
      },
      {
        id: 3,
        title: 'Digital Learning & Smart Classroom Training',
        date: new Date('2023-03-20'),
        type: 'training',
        description: 'Completed intensive training on integrating technology and digital tools in mathematics education',
        issuer: 'Educational Technology Council of India'
      },
      {
        id: 4,
        title: 'Mathematics Excellence Award',
        date: new Date('2021-12-05'),
        type: 'recognition',
        description: 'Recognized for exceptional student performance in state mathematics assessments',
        issuer: 'State Department of Education'
      },
      {
        id: 5,
        title: 'Leadership in Education',
        date: new Date('2022-08-30'),
        type: 'award',
        description: 'Outstanding leadership in mentoring new teachers and curriculum development',
        issuer: 'District Education Board'
      },
      {
        id: 6,
        title: 'STEM Education Specialist',
        date: new Date('2021-06-15'),
        type: 'certification',
        description: 'Specialized certification in integrated STEM education methodologies',
        issuer: 'STEM Education Alliance'
      }
    ],
    emergencyContact: {
      name: 'Priya Kumar',
      relationship: 'Spouse',
      phone: '+91-9876543211'
    },
    address: {
      street: 'B-24, Sector 15, Rohini',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110085',
      country: 'India'
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        gradeUpdates: true,
        behaviorAlerts: true,
        parentMessages: true,
        systemUpdates: false
      },
      privacy: {
        showEmail: true,
        showPhone: false,
        allowParentContact: true,
        profileVisibility: 'staff'
      },
      preferences: {
        language: 'en',
        timezone: 'America/Los_Angeles',
        dateFormat: 'MM/dd/yyyy',
        gradeFormat: 'percentage',
        autoSave: true,
        darkMode: false
      },
      communication: {
        responseTime: 'same_day',
        availableHours: {
          start: '08:00',
          end: '16:00'
        },
        preferredMethod: 'email',
        officeHours: 'Monday-Friday: 3:00 PM - 4:00 PM\nAvailable for parent conferences by appointment\nOffice: Room 205, Mathematics Building'
      }
    },
    statistics: {
      totalStudents: 147,
      averageGrade: 87,
      yearsExperience: 8,
      classesTaught: 24,
      parentSatisfaction: 4.8
    }
  };

  setActiveTab(tab: 'personal' | 'professional' | 'settings' | 'achievements') {
    this.activeTab = tab;
  }

  getFullName(): string {
    return `${this.teacherProfile.firstName} ${this.teacherProfile.lastName}`;
  }

  getInitials(): string {
    return `${this.teacherProfile.firstName[0]}${this.teacherProfile.lastName[0]}`;
  }

  enableEditMode() {
    this.editMode = true;
  }

  saveProfile() {
    // In a real app, this would save to a backend service
    console.log('Saving profile:', this.teacherProfile);
    this.editMode = false;
    // Show success message
  }

  cancelEdit() {
    // In a real app, this would revert changes
    this.editMode = false;
    // Reload original data
  }

  updateDateOfBirth(dateString: string) {
    this.teacherProfile.dateOfBirth = new Date(dateString);
  }

  addSpecialization() {
    if (this.newSpecialization.trim()) {
      this.teacherProfile.specializations.push(this.newSpecialization.trim());
      this.newSpecialization = '';
    }
  }

  removeSpecialization(spec: string) {
    const index = this.teacherProfile.specializations.indexOf(spec);
    if (index > -1) {
      this.teacherProfile.specializations.splice(index, 1);
    }
  }

  getAchievementsByType(type: string): Achievement[] {
    return this.teacherProfile.achievements.filter(achievement => achievement.type === type);
  }

  // Action Methods
  changeProfilePhoto() {
    console.log('Change profile photo');
    // In a real app, this would open a file picker
  }

  addQualification() {
    console.log('Add qualification');
    // In a real app, this would open a form modal
  }

  addExperience() {
    console.log('Add experience');
    // In a real app, this would open a form modal
  }

  addAchievement() {
    console.log('Add achievement');
    // In a real app, this would open a form modal
  }

  exportProfile() {
    console.log('Export profile');
    // In a real app, this would generate a PDF or document
  }

  changePassword() {
    console.log('Change password');
    // In a real app, this would open a password change modal
  }
}