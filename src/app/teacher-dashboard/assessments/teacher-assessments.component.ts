import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Assessment {
  id: number;
  title: string;
  subject: string;
  class: string;
  type: 'quiz' | 'test' | 'exam' | 'assignment';
  totalMarks: number;
  duration: number; // in minutes
  date: Date;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  questions: Question[];
  results: StudentResult[];
}

interface Question {
  id: number;
  type: 'mcq' | 'short' | 'long' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

interface StudentResult {
  studentId: number;
  studentName: string;
  rollNumber: string;
  marks: number;
  percentage: number;
  grade: string;
  submittedAt?: Date;
  answers: any[];
}

@Component({
  selector: 'app-teacher-assessments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="assessments-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">📊 Student Assessments</h1>
        <p class="page-subtitle">Create assessments, track performance, and analyze results</p>
      </div>

      <!-- Action Buttons -->
      <div class="action-header">
        <button class="create-btn" (click)="showCreateForm = true">
          ➕ Create Assessment
        </button>
        <div class="filter-controls">
          <select [(ngModel)]="selectedClass" (change)="filterAssessments()">
            <option value="">All Classes</option>
            <option value="Class 10-A">Class 10-A</option>
            <option value="Class 9-B">Class 9-B</option>
            <option value="Class 8-C">Class 8-C</option>
          </select>
          <select [(ngModel)]="selectedStatus" (change)="filterAssessments()">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <!-- Assessment Stats -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-number">{{ assessments.length }}</div>
            <div class="stat-label">Total Assessments</div>
          </div>
        </div>
        <div class="stat-card active">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <div class="stat-number">{{ getActiveCount() }}</div>
            <div class="stat-label">Active Now</div>
          </div>
        </div>
        <div class="stat-card completed">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-number">{{ getCompletedCount() }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        <div class="stat-card avg-score">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-number">{{ getAverageScore() }}%</div>
            <div class="stat-label">Avg Score</div>
          </div>
        </div>
      </div>

      <!-- Assessment Grid -->
      <div class="assessments-grid">
        <div *ngFor="let assessment of filteredAssessments" class="assessment-card" [class]="assessment.status">
          <div class="assessment-header">
            <div class="assessment-title">{{ assessment.title }}</div>
            <div class="assessment-status" [class]="assessment.status">
              <span *ngIf="assessment.status === 'draft'">📄</span>
              <span *ngIf="assessment.status === 'scheduled'">📅</span>
              <span *ngIf="assessment.status === 'active'">⏰</span>
              <span *ngIf="assessment.status === 'completed'">✅</span>
              {{ assessment.status | titlecase }}
            </div>
          </div>

          <div class="assessment-meta">
            <div class="meta-row">
              <span class="label">Subject:</span>
              <span class="value">{{ assessment.subject }}</span>
            </div>
            <div class="meta-row">
              <span class="label">Class:</span>
              <span class="value">{{ assessment.class }}</span>
            </div>
            <div class="meta-row">
              <span class="label">Type:</span>
              <span class="value">{{ assessment.type | titlecase }}</span>
            </div>
            <div class="meta-row">
              <span class="label">Date:</span>
              <span class="value">{{ assessment.date | date:'MMM dd, yyyy' }}</span>
            </div>
            <div class="meta-row">
              <span class="label">Duration:</span>
              <span class="value">{{ assessment.duration }} mins</span>
            </div>
            <div class="meta-row">
              <span class="label">Total Marks:</span>
              <span class="value">{{ assessment.totalMarks }}</span>
            </div>
          </div>

          <div class="assessment-progress" *ngIf="assessment.status === 'completed'">
            <div class="progress-stats">
              <div class="progress-stat">
                <span class="stat-value">{{ assessment.results.length }}</span>
                <span class="stat-label">Students</span>
              </div>
              <div class="progress-stat">
                <span class="stat-value">{{ getAssessmentAverage(assessment) }}%</span>
                <span class="stat-label">Avg Score</span>
              </div>
              <div class="progress-stat">
                <span class="stat-value">{{ getPassCount(assessment) }}</span>
                <span class="stat-label">Passed</span>
              </div>
            </div>
            <div class="score-distribution">
              <div class="distribution-bar">
                <div class="grade-segment a" [style.width.%]="getGradePercentage(assessment, 'A')"></div>
                <div class="grade-segment b" [style.width.%]="getGradePercentage(assessment, 'B')"></div>
                <div class="grade-segment c" [style.width.%]="getGradePercentage(assessment, 'C')"></div>
                <div class="grade-segment d" [style.width.%]="getGradePercentage(assessment, 'D')"></div>
                <div class="grade-segment f" [style.width.%]="getGradePercentage(assessment, 'F')"></div>
              </div>
              <div class="grade-legend">
                <span class="legend-item a">A</span>
                <span class="legend-item b">B</span>
                <span class="legend-item c">C</span>
                <span class="legend-item d">D</span>
                <span class="legend-item f">F</span>
              </div>
            </div>
          </div>

          <div class="assessment-actions">
            <button class="action-btn view" (click)="viewAssessment(assessment)">
              👁️ View
            </button>
            <button class="action-btn edit" (click)="editAssessment(assessment)" *ngIf="assessment.status === 'draft'">
              ✏️ Edit
            </button>
            <button class="action-btn results" (click)="viewResults(assessment)" *ngIf="assessment.status === 'completed'">
              📊 Results
            </button>
            <button class="action-btn start" (click)="startAssessment(assessment)" *ngIf="assessment.status === 'scheduled'">
              ▶️ Start
            </button>
            <button class="action-btn delete" (click)="deleteAssessment(assessment.id)">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Create Assessment Modal -->
      <div class="modal-overlay" *ngIf="showCreateForm" (click)="showCreateForm = false">
        <div class="create-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Create New Assessment</h3>
            <button class="close-btn" (click)="showCreateForm = false">✕</button>
          </div>
          
          <form (ngSubmit)="createAssessment()" #assessmentForm="ngForm" class="assessment-form">
            <div class="form-section">
              <h4>Basic Information</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Title *</label>
                  <input type="text" [(ngModel)]="newAssessment.title" name="title" required>
                </div>
                <div class="form-group">
                  <label>Type *</label>
                  <select [(ngModel)]="newAssessment.type" name="type" required>
                    <option value="">Select Type</option>
                    <option value="quiz">Quiz</option>
                    <option value="test">Test</option>
                    <option value="exam">Exam</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Subject *</label>
                  <select [(ngModel)]="newAssessment.subject" name="subject" required>
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Class *</label>
                  <select [(ngModel)]="newAssessment.class" name="class" required>
                    <option value="">Select Class</option>
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 9-B">Class 9-B</option>
                    <option value="Class 8-C">Class 8-C</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Date & Time *</label>
                  <input type="datetime-local" [(ngModel)]="newAssessment.date" name="date" required>
                </div>
                <div class="form-group">
                  <label>Duration (minutes) *</label>
                  <input type="number" [(ngModel)]="newAssessment.duration" name="duration" min="5" max="180" required>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Questions</h4>
              <div class="questions-section">
                <div *ngFor="let question of newAssessment.questions; let i = index" class="question-item">
                  <div class="question-header">
                    <span class="question-number">Q{{ i + 1 }}</span>
                    <select [(ngModel)]="question.type" [name]="'questionType' + i">
                      <option value="mcq">Multiple Choice</option>
                      <option value="short">Short Answer</option>
                      <option value="long">Long Answer</option>
                      <option value="true-false">True/False</option>
                    </select>
                    <input type="number" [(ngModel)]="question.marks" [name]="'marks' + i" 
                           placeholder="Marks" min="1" max="50" class="marks-input">
                    <button type="button" class="remove-question" (click)="removeQuestion(i)">🗑️</button>
                  </div>
                  
                  <textarea [(ngModel)]="question.question" [name]="'question' + i" 
                            placeholder="Enter your question here..." rows="2"></textarea>
                  
                  <div *ngIf="question.type === 'mcq'" class="mcq-options">
                    <div *ngFor="let option of question.options; let j = index" class="option-row">
                      <input type="text" [(ngModel)]="question.options![j]" 
                             [name]="'option' + i + '_' + j" [placeholder]="'Option ' + (j + 1)">
                      <input type="radio" [name]="'correct' + i" [value]="j" 
                             (change)="setCorrectAnswer(i, j)" class="correct-radio">
                    </div>
                  </div>
                  
                  <div *ngIf="question.type === 'true-false'" class="tf-options">
                    <label>
                      <input type="radio" [name]="'tf' + i" value="true" 
                             (change)="question.correctAnswer = 'true'"> True
                    </label>
                    <label>
                      <input type="radio" [name]="'tf' + i" value="false" 
                             (change)="question.correctAnswer = 'false'"> False
                    </label>
                  </div>
                </div>
                
                <button type="button" class="add-question-btn" (click)="addQuestion()">
                  ➕ Add Question
                </button>
              </div>
            </div>

            <div class="form-actions">
              <div class="total-marks">
                Total Marks: {{ getTotalMarks() }}
              </div>
              <button type="button" class="cancel-btn" (click)="showCreateForm = false">Cancel</button>
              <button type="button" class="draft-btn" (click)="saveDraft()">Save as Draft</button>
              <button type="submit" class="submit-btn" [disabled]="!assessmentForm.valid">Schedule Assessment</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Results Modal -->
      <div class="modal-overlay" *ngIf="showResultsModal" (click)="showResultsModal = false">
        <div class="results-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Assessment Results - {{ selectedAssessment?.title }}</h3>
            <button class="close-btn" (click)="showResultsModal = false">✕</button>
          </div>
          
          <div class="results-summary">
            <div class="summary-stats">
              <div class="summary-stat">
                <span class="stat-label">Students Appeared:</span>
                <span class="stat-value">{{ selectedAssessment?.results?.length || 0 }}</span>
              </div>
              <div class="summary-stat">
                <span class="stat-label">Average Score:</span>
                <span class="stat-value">{{ getAssessmentAverage(selectedAssessment!) }}%</span>
              </div>
              <div class="summary-stat">
                <span class="stat-label">Highest Score:</span>
                <span class="stat-value">{{ getHighestScore(selectedAssessment!) }}%</span>
              </div>
              <div class="summary-stat">
                <span class="stat-label">Pass Rate:</span>
                <span class="stat-value">{{ getPassRate(selectedAssessment!) }}%</span>
              </div>
            </div>
          </div>

          <div class="results-table">
            <div class="table-header">
              <div class="col">Student Name</div>
              <div class="col">Roll No</div>
              <div class="col">Marks</div>
              <div class="col">Percentage</div>
              <div class="col">Grade</div>
              <div class="col">Submitted At</div>
            </div>
            <div *ngFor="let result of selectedAssessment?.results" class="table-row">
              <div class="col">{{ result.studentName }}</div>
              <div class="col">{{ result.rollNumber }}</div>
              <div class="col">{{ result.marks }}/{{ selectedAssessment?.totalMarks }}</div>
              <div class="col">{{ result.percentage }}%</div>
              <div class="col grade" [class]="result.grade.toLowerCase()">{{ result.grade }}</div>
              <div class="col">{{ result.submittedAt | date:'MMM dd, HH:mm' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assessments-container {
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

    .action-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

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

    .filter-controls {
      display: flex;
      gap: 1rem;
    }

    .filter-controls select {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
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

    .stat-card.total { border-left-color: #3b82f6; }
    .stat-card.active { border-left-color: #f59e0b; }
    .stat-card.completed { border-left-color: #10b981; }
    .stat-card.avg-score { border-left-color: #8b5cf6; }

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

    /* Assessment Grid */
    .assessments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .assessment-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-left: 4px solid;
      transition: transform 0.3s ease;
    }

    .assessment-card:hover {
      transform: translateY(-4px);
    }

    .assessment-card.draft { border-left-color: #fbbf24; }
    .assessment-card.scheduled { border-left-color: #3b82f6; }
    .assessment-card.active { border-left-color: #f59e0b; }
    .assessment-card.completed { border-left-color: #10b981; }

    .assessment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .assessment-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1e293b;
      flex: 1;
    }

    .assessment-status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .assessment-status.draft { background: #fef3c7; color: #92400e; }
    .assessment-status.scheduled { background: #dbeafe; color: #1e40af; }
    .assessment-status.active { background: #fed7aa; color: #c2410c; }
    .assessment-status.completed { background: #dcfce7; color: #166534; }

    .assessment-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .meta-row {
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

    .assessment-progress {
      margin-bottom: 1rem;
    }

    .progress-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .progress-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      background: #f8fafc;
      border-radius: 8px;
      flex: 1;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    .distribution-bar {
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      margin-bottom: 0.5rem;
    }

    .grade-segment {
      height: 100%;
    }

    .grade-segment.a { background: #10b981; }
    .grade-segment.b { background: #3b82f6; }
    .grade-segment.c { background: #f59e0b; }
    .grade-segment.d { background: #ef4444; }
    .grade-segment.f { background: #6b7280; }

    .grade-legend {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .legend-item {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .legend-item.a { background: #10b981; color: white; }
    .legend-item.b { background: #3b82f6; color: white; }
    .legend-item.c { background: #f59e0b; color: white; }
    .legend-item.d { background: #ef4444; color: white; }
    .legend-item.f { background: #6b7280; color: white; }

    .assessment-actions {
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

    .action-btn.view { background: #f0f9ff; color: #1e40af; }
    .action-btn.edit { background: #fef3c7; color: #92400e; }
    .action-btn.results { background: #f0fdf4; color: #166534; }
    .action-btn.start { background: #fed7aa; color: #c2410c; }
    .action-btn.delete { background: #fef2f2; color: #dc2626; }

    /* Modal Styles */
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

    .create-modal,
    .results-modal {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .assessment-form {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h4 {
      margin-bottom: 1rem;
      color: #1e293b;
      font-size: 1.1rem;
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
    }

    .questions-section {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 1rem;
    }

    .question-item {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .question-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .question-number {
      font-weight: 600;
      color: #1e293b;
      min-width: 30px;
    }

    .marks-input {
      width: 80px;
    }

    .remove-question {
      background: #fef2f2;
      color: #dc2626;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .mcq-options,
    .tf-options {
      margin-top: 0.5rem;
    }

    .option-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .option-row input[type="text"] {
      flex: 1;
    }

    .correct-radio {
      width: 20px;
      height: 20px;
    }

    .tf-options {
      display: flex;
      gap: 2rem;
    }

    .tf-options label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .add-question-btn {
      background: #f0f9ff;
      color: #1e40af;
      border: 2px dashed #3b82f6;
      padding: 1rem;
      border-radius: 8px;
      width: 100%;
      cursor: pointer;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .total-marks {
      font-weight: 600;
      color: #1e293b;
      font-size: 1.1rem;
    }

    .cancel-btn,
    .draft-btn,
    .submit-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-btn { background: #f1f5f9; color: #64748b; }
    .draft-btn { background: #fbbf24; color: white; }
    .submit-btn { background: #3b82f6; color: white; }

    /* Results Modal */
    .results-summary {
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .summary-stat {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
    }

    .results-table {
      padding: 1.5rem;
      overflow-x: auto;
    }

    .table-header,
    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
      gap: 1rem;
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-header {
      font-weight: 600;
      color: #1e293b;
      background: #f8fafc;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .col.grade {
      font-weight: 600;
      text-align: center;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .col.grade.a { background: #dcfce7; color: #166534; }
    .col.grade.b { background: #dbeafe; color: #1e40af; }
    .col.grade.c { background: #fef3c7; color: #92400e; }
    .col.grade.d { background: #fed7aa; color: #c2410c; }
    .col.grade.f { background: #fee2e2; color: #dc2626; }

    /* Responsive */
    @media (max-width: 768px) {
      .assessments-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
  `]
})
export class TeacherAssessmentsComponent {
  showCreateForm = false;
  showResultsModal = false;
  selectedClass = '';
  selectedStatus = '';
  selectedAssessment: Assessment | null = null;

  newAssessment = {
    title: '',
    subject: '',
    class: '',
    type: 'quiz' as 'quiz' | 'test' | 'exam' | 'assignment',
    date: '',
    duration: 60,
    questions: [] as Question[]
  };

  assessments: Assessment[] = [
    {
      id: 1,
      title: 'Algebra Chapter 5 Test',
      subject: 'Mathematics',
      class: 'Class 10-A',
      type: 'test',
      totalMarks: 50,
      duration: 90,
      date: new Date('2025-09-20'),
      status: 'completed',
      questions: [],
      results: [
        { studentId: 1, studentName: 'John Smith', rollNumber: '101', marks: 45, percentage: 90, grade: 'A', submittedAt: new Date(), answers: [] },
        { studentId: 2, studentName: 'Sarah Johnson', rollNumber: '102', marks: 42, percentage: 84, grade: 'B', submittedAt: new Date(), answers: [] },
        { studentId: 3, studentName: 'Mike Wilson', rollNumber: '103', marks: 35, percentage: 70, grade: 'B', submittedAt: new Date(), answers: [] },
        { studentId: 4, studentName: 'Emma Brown', rollNumber: '104', marks: 28, percentage: 56, grade: 'C', submittedAt: new Date(), answers: [] }
      ]
    },
    {
      id: 2,
      title: 'Geometry Quiz',
      subject: 'Mathematics',
      class: 'Class 9-B',
      type: 'quiz',
      totalMarks: 20,
      duration: 30,
      date: new Date('2025-09-25'),
      status: 'scheduled',
      questions: [],
      results: []
    },
    {
      id: 3,
      title: 'Physics Exam Draft',
      subject: 'Science',
      class: 'Class 10-A',
      type: 'exam',
      totalMarks: 100,
      duration: 120,
      date: new Date('2025-10-01'),
      status: 'draft',
      questions: [],
      results: []
    }
  ];

  get filteredAssessments() {
    return this.assessments.filter(assessment => {
      const classMatch = !this.selectedClass || assessment.class === this.selectedClass;
      const statusMatch = !this.selectedStatus || assessment.status === this.selectedStatus;
      return classMatch && statusMatch;
    });
  }

  filterAssessments() {
    // Filter logic is handled by the getter
  }

  getActiveCount(): number {
    return this.assessments.filter(a => a.status === 'active').length;
  }

  getCompletedCount(): number {
    return this.assessments.filter(a => a.status === 'completed').length;
  }

  getAverageScore(): number {
    const completedAssessments = this.assessments.filter(a => a.status === 'completed');
    if (completedAssessments.length === 0) return 0;
    
    const totalAverage = completedAssessments.reduce((sum, assessment) => {
      return sum + this.getAssessmentAverage(assessment);
    }, 0);
    
    return Math.round(totalAverage / completedAssessments.length);
  }

  getAssessmentAverage(assessment: Assessment): number {
    if (assessment.results.length === 0) return 0;
    const total = assessment.results.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(total / assessment.results.length);
  }

  getPassCount(assessment: Assessment): number {
    return assessment.results.filter(r => r.percentage >= 40).length;
  }

  getGradePercentage(assessment: Assessment, grade: string): number {
    const gradeCount = assessment.results.filter(r => r.grade === grade).length;
    return assessment.results.length > 0 ? (gradeCount / assessment.results.length) * 100 : 0;
  }

  getHighestScore(assessment: Assessment): number {
    if (assessment.results.length === 0) return 0;
    return Math.max(...assessment.results.map(r => r.percentage));
  }

  getPassRate(assessment: Assessment): number {
    if (assessment.results.length === 0) return 0;
    const passCount = this.getPassCount(assessment);
    return Math.round((passCount / assessment.results.length) * 100);
  }

  addQuestion() {
    const newQuestion: Question = {
      id: Date.now(),
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      marks: 1
    };
    this.newAssessment.questions.push(newQuestion);
  }

  removeQuestion(index: number) {
    this.newAssessment.questions.splice(index, 1);
  }

  setCorrectAnswer(questionIndex: number, optionIndex: number) {
    this.newAssessment.questions[questionIndex].correctAnswer = optionIndex.toString();
  }

  getTotalMarks(): number {
    return this.newAssessment.questions.reduce((total, question) => total + question.marks, 0);
  }

  createAssessment() {
    const assessment: Assessment = {
      id: Date.now(),
      title: this.newAssessment.title,
      subject: this.newAssessment.subject,
      class: this.newAssessment.class,
      type: this.newAssessment.type,
      totalMarks: this.getTotalMarks(),
      duration: this.newAssessment.duration,
      date: new Date(this.newAssessment.date),
      status: 'scheduled',
      questions: this.newAssessment.questions,
      results: []
    };

    this.assessments.unshift(assessment);
    this.resetForm();
    this.showCreateForm = false;
  }

  saveDraft() {
    const assessment: Assessment = {
      id: Date.now(),
      title: this.newAssessment.title,
      subject: this.newAssessment.subject,
      class: this.newAssessment.class,
      type: this.newAssessment.type,
      totalMarks: this.getTotalMarks(),
      duration: this.newAssessment.duration,
      date: new Date(this.newAssessment.date),
      status: 'draft',
      questions: this.newAssessment.questions,
      results: []
    };

    this.assessments.unshift(assessment);
    this.resetForm();
    this.showCreateForm = false;
  }

  resetForm() {
    this.newAssessment = {
      title: '',
      subject: '',
      class: '',
      type: 'quiz',
      date: '',
      duration: 60,
      questions: []
    };
  }

  viewAssessment(assessment: Assessment) {
    console.log('View assessment:', assessment);
  }

  editAssessment(assessment: Assessment) {
    console.log('Edit assessment:', assessment);
  }

  viewResults(assessment: Assessment) {
    this.selectedAssessment = assessment;
    this.showResultsModal = true;
  }

  startAssessment(assessment: Assessment) {
    assessment.status = 'active';
    console.log('Assessment started:', assessment);
  }

  deleteAssessment(id: number) {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.assessments = this.assessments.filter(a => a.id !== id);
    }
  }
}