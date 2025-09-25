import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homework',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="homework-container">
      <div class="homework-header">
        <h1>📚 Homework & Assignments</h1>
        <p>Track your academic progress and stay on top of your assignments</p>
      </div>
      
      <div class="homework-tabs">
        <button 
          *ngFor="let tab of homeworkTabs" 
          class="tab-button"
          [class.active]="activeTab === tab.id"
          (click)="switchTab(tab.id)">
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <div class="tab-content">
        <div *ngIf="activeTab === 'pending'">
          <h2>Pending Assignments</h2>
          <div class="assignment-list">
            <div class="assignment-card" *ngFor="let assignment of pendingHomework">
              <div class="card-header">
                <span class="subject-badge">{{ assignment.subject }}</span>
                <span class="priority-badge" [class]="'priority-' + assignment.priority">{{ assignment.priority }}</span>
              </div>
              <h3>{{ assignment.title }}</h3>
              <p>{{ assignment.description }}</p>
              <div class="assignment-meta">
                <div>👨‍🏫 {{ assignment.teacher }}</div>
                <div>⏱️ {{ assignment.estimatedTime }}</div>
                <div>📅 Due: {{ assignment.dueDate | date:'short' }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="activeTab === 'completed'">
          <h2>Completed Assignments</h2>
          <div class="completed-list">
            <div class="completed-item" *ngFor="let assignment of completedHomework">
              <div class="completed-header">
                <span class="subject-badge">{{ assignment.subject }}</span>
                <span class="grade">{{ assignment.grade }}</span>
              </div>
              <h3>{{ assignment.title }}</h3>
              <p>{{ assignment.description }}</p>
              <div class="feedback" *ngIf="assignment.feedback">
                <strong>Feedback:</strong> {{ assignment.feedback }}
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="activeTab === 'overdue'">
          <h2>Overdue Assignments</h2>
          <div class="overdue-list">
            <div class="overdue-item" *ngFor="let assignment of overdueHomework">
              <div class="overdue-warning">🚨 {{ assignment.daysOverdue }} days overdue</div>
              <span class="subject-badge">{{ assignment.subject }}</span>
              <h3>{{ assignment.title }}</h3>
              <p>{{ assignment.description }}</p>
              <div>Originally due: {{ assignment.dueDate | date:'short' }}</div>
            </div>
          </div>
        </div>
        
        <div *ngIf="activeTab === 'upcoming'">
          <h2>Upcoming Assignments</h2>
          <div class="upcoming-list">
            <div class="upcoming-item" *ngFor="let assignment of upcomingHomework">
              <span class="subject-badge">{{ assignment.subject }}</span>
              <h3>{{ assignment.title }}</h3>
              <p>{{ assignment.description }}</p>
              <div>Due: {{ assignment.dueDate | date:'short' }}</div>
              <div>{{ getDaysUntilDue(assignment.dueDate) }} days remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .homework-container {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      height: 100%;
      overflow-y: auto;
    }
    
    .homework-header {
      margin-bottom: 1.5rem;
    }
    
    .homework-header h1 {
      font-size: 1.75rem;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .homework-header p {
      color: #6b7280;
      font-size: 0.95rem;
      font-weight: 400;
    }
    
    .homework-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      background: white;
      padding: 0.375rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .tab-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 400;
    }
    
    .tab-button:hover {
      background: #f3f4f6;
      color: #374151;
    }
    
    .tab-button.active {
      background: #3b82f6;
      color: white;
      font-weight: 500;
    }
    
    .tab-count {
      background: rgba(255,255,255,0.2);
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .assignment-list, .completed-list, .overdue-list, .upcoming-list {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }
    
    .assignment-card, .completed-item, .overdue-item, .upcoming-item {
      background: white;
      padding: 1.25rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
    }
    
    .card-header, .completed-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    
    .subject-badge {
      background: #dbeafe;
      color: #1d4ed8;
      padding: 0.375rem 0.75rem;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .priority-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .priority-high {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .priority-medium {
      background: #fef3c7;
      color: #92400e;
    }
    
    .priority-low {
      background: #d1fae5;
      color: #065f46;
    }
    
    .grade {
      background: #10b981;
      color: white;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .assignment-meta > div {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      margin-bottom: 0.375rem;
      color: #6b7280;
      font-size: 0.8rem;
      font-weight: 400;
    }
    
    .overdue-warning {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.5rem;
      border-radius: 6px;
      margin-bottom: 0.75rem;
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .feedback {
      background: #f8fafc;
      padding: 0.875rem;
      border-radius: 6px;
      margin-top: 0.75rem;
      border-left: 3px solid #3b82f6;
      font-size: 0.875rem;
      font-weight: 400;
    }
    
    h2 {
      font-size: 1.375rem;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    h3 {
      font-size: 1rem;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 0.375rem;
      line-height: 1.4;
    }
    
    p {
      color: #4b5563;
      line-height: 1.5;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      font-weight: 400;
    }
  `]
})
export class HomeworkComponent implements OnInit {
  activeTab: string = 'pending';
  
  homeworkTabs = [
    { id: 'pending', label: 'Pending', icon: '⏳', count: 5 },
    { id: 'completed', label: 'Completed', icon: '✅', count: 8 },
    { id: 'overdue', label: 'Overdue', icon: '🚨', count: 2 },
    { id: 'upcoming', label: 'Upcoming', icon: '📅', count: 3 }
  ];

  pendingHomework = [
    {
      id: 1,
      subject: 'Mathematics',
      title: 'Quadratic Equations - Practice Problems',
      description: 'Solve all problems from Exercise 4.3 (Questions 1-15). Show complete working for each solution.',
      dueDate: '2025-09-23',
      dueTime: '11:59 PM',
      priority: 'high',
      estimatedTime: '2 hours',
      attachments: ['quadratic_formulas.pdf', 'practice_sheet.docx'],
      submissionType: 'online',
      teacher: 'Mrs. Sarah Johnson'
    },
    {
      id: 2,
      subject: 'English Literature',
      title: 'Essay: Character Analysis of Hamlet',
      description: 'Write a 1000-word essay analyzing the character development of Hamlet throughout the play.',
      dueDate: '2025-09-25',
      dueTime: '9:00 AM',
      priority: 'medium',
      estimatedTime: '3 hours',
      attachments: ['essay_guidelines.pdf', 'hamlet_text.pdf'],
      submissionType: 'online',
      teacher: 'Mr. David Wilson'
    },
    {
      id: 3,
      subject: 'Science',
      title: 'Chemistry Lab Report - Acid-Base Reactions',
      description: 'Complete the lab report based on yesterday\'s experiment. Include observations, calculations, and conclusions.',
      dueDate: '2025-09-24',
      dueTime: '2:00 PM',
      priority: 'high',
      estimatedTime: '1.5 hours',
      attachments: ['lab_template.docx', 'experiment_data.xlsx'],
      submissionType: 'physical',
      teacher: 'Dr. Emily Chen'
    },
    {
      id: 4,
      subject: 'History',
      title: 'Research Project: World War II Timeline',
      description: 'Create a detailed timeline of major events during WWII with explanations for each event.',
      dueDate: '2025-09-26',
      dueTime: '5:00 PM',
      priority: 'medium',
      estimatedTime: '4 hours',
      attachments: ['timeline_template.pptx', 'research_sources.pdf'],
      submissionType: 'presentation',
      teacher: 'Mr. Robert Thompson'
    },
    {
      id: 5,
      subject: 'Computer Science',
      title: 'Python Programming Assignment',
      description: 'Create a simple calculator program using Python. Include all basic arithmetic operations.',
      dueDate: '2025-09-27',
      dueTime: '11:59 PM',
      priority: 'low',
      estimatedTime: '2 hours',
      attachments: ['python_basics.pdf', 'starter_code.py'],
      submissionType: 'online',
      teacher: 'Ms. Lisa Park'
    }
  ];

  completedHomework = [
    {
      id: 6,
      subject: 'Mathematics',
      title: 'Geometry - Circle Theorems',
      description: 'Prove the given circle theorems using geometric constructions.',
      submittedDate: '2025-09-20',
      grade: 'A-',
      feedback: 'Excellent work on most theorems. Minor error in theorem 3.',
      teacher: 'Mrs. Sarah Johnson'
    },
    {
      id: 7,
      subject: 'English Literature',
      title: 'Poetry Analysis - Robert Frost',
      description: 'Analyze the themes and literary devices in "The Road Not Taken".',
      submittedDate: '2025-09-18',
      grade: 'B+',
      feedback: 'Good analysis of themes. Could improve on literary device identification.',
      teacher: 'Mr. David Wilson'
    }
  ];

  overdueHomework = [
    {
      id: 8,
      subject: 'Science',
      title: 'Physics - Motion Graphs',
      description: 'Draw and interpret velocity-time graphs for given scenarios.',
      dueDate: '2025-09-20',
      daysOverdue: 2,
      priority: 'high',
      teacher: 'Dr. Michael Brown'
    },
    {
      id: 9,
      subject: 'French',
      title: 'Vocabulary Quiz Preparation',
      description: 'Learn 50 new French vocabulary words for the upcoming quiz.',
      dueDate: '2025-09-21',
      daysOverdue: 1,
      priority: 'medium',
      teacher: 'Mme. Claire Dubois'
    }
  ];

  upcomingHomework = [
    {
      id: 10,
      subject: 'Art',
      title: 'Still Life Drawing',
      description: 'Create a detailed pencil drawing of the provided still life arrangement.',
      dueDate: '2025-09-30',
      priority: 'low',
      estimatedTime: '3 hours',
      teacher: 'Ms. Rachel Green'
    },
    {
      id: 11,
      subject: 'Geography',
      title: 'Climate Change Research',
      description: 'Research and present findings on climate change effects in your region.',
      dueDate: '2025-10-02',
      priority: 'medium',
      estimatedTime: '2.5 hours',
      teacher: 'Mr. James Miller'
    }
  ];

  ngOnInit() {
    // Initialize component
  }

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  getDaysUntilDue(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSubmissionTypeIcon(type: string): string {
    switch (type) {
      case 'online': return '💻';
      case 'physical': return '📄';
      case 'presentation': return '📊';
      default: return '📝';
    }
  }
}