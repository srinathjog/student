import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FeeItem {
  id: number;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: Date;
  category: string;
}

interface FeeNotification {
  id: number;
  message: string;
  date: Date;
  type: 'reminder' | 'warning' | 'success';
  feeId: number;
}

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fees-container">
      <div class="fees-header">
        <h1 class="page-title">💰 Fee Management</h1>
        <p class="page-subtitle">Track your child's fee payments and stay updated</p>
      </div>

      <!-- Main Dashboard Cards Grid -->
      <div class="dashboard-grid">
        
        <!-- Fee Analytics Card with Circular Progress -->
        <div class="analytics-card">
          <h3>📊 Fee Analytics</h3>
          <div class="circular-progress-container">
            <div class="circular-progress">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" stroke-width="8" 
                        stroke-dasharray="314" stroke-dashoffset="104.6" 
                        stroke-linecap="round" transform="rotate(-90 60 60)"/>
              </svg>
              <div class="progress-text">
                <div class="percentage">{{ paidPercentage }}%</div>
                <div class="label">Paid</div>
              </div>
            </div>
            <div class="analytics-summary">
              <div class="analytics-item">
                <span class="dot paid"></span>
                <span>Paid: ₹{{ paidFees | number }}</span>
              </div>
              <div class="analytics-item">
                <span class="dot pending"></span>
                <span>Pending: ₹{{ pendingFees | number }}</span>
              </div>
              <div class="analytics-item">
                <span class="dot overdue"></span>
                <span>Overdue: ₹{{ lateFees | number }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Summary Cards -->
        <div class="summary-cards-grid">
          <div class="mini-card total">
            <div class="mini-icon">📊</div>
            <div class="mini-content">
              <div class="mini-amount">₹{{ totalFees | number }}</div>
              <div class="mini-label">Total Fees</div>
            </div>
          </div>
          
          <div class="mini-card paid">
            <div class="mini-icon">✅</div>
            <div class="mini-content">
              <div class="mini-amount">₹{{ paidFees | number }}</div>
              <div class="mini-label">Paid</div>
            </div>
          </div>
          
          <div class="mini-card pending">
            <div class="mini-icon">⏳</div>
            <div class="mini-content">
              <div class="mini-amount">₹{{ pendingFees | number }}</div>
              <div class="mini-label">Pending</div>
            </div>
          </div>
          
          <div class="mini-card overdue">
            <div class="mini-icon">🚨</div>
            <div class="mini-content">
              <div class="mini-amount">₹{{ lateFees | number }}</div>
              <div class="mini-label">Overdue</div>
            </div>
          </div>
        </div>

        <!-- Fee Breakdown Card -->
        <div class="breakdown-card">
          <h3>📋 Fee Breakdown</h3>
          <div class="fee-items">
            <div *ngFor="let fee of feeItems" class="compact-fee-item" [class]="fee.status">
              <div class="fee-info">
                <div class="fee-name">{{fee.name}}</div>
                <div class="fee-due">Due: {{fee.dueDate | date:'MMM dd'}}</div>
              </div>
              <div class="fee-details">
                <div class="fee-amount">₹{{fee.amount | number}}</div>
                <span class="fee-status-badge" [class]="fee.status">
                  <span *ngIf="fee.status === 'paid'">✅</span>
                  <span *ngIf="fee.status === 'pending'">⏳</span>
                  <span *ngIf="fee.status === 'overdue'">🚨</span>
                </span>
                <button *ngIf="fee.status !== 'paid'" class="mini-pay-btn">Pay</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Card -->
        <div class="notifications-card">
          <h3>� Notifications</h3>
          <div class="notification-items">
            <div *ngFor="let notification of notifications" class="compact-notification" [class]="notification.type">
              <div class="notification-icon">
                <span *ngIf="notification.type === 'reminder'">�</span>
                <span *ngIf="notification.type === 'warning'">⚠️</span>
                <span *ngIf="notification.type === 'success'">✅</span>
              </div>
              <div class="notification-content">
                <div class="notification-message">{{notification.message}}</div>
                <div class="notification-date">{{notification.date | date:'MMM dd'}}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment History Card -->
        <div class="history-card">
          <h3>💳 Recent Payments</h3>
          <div class="payment-items">
            <div *ngFor="let payment of recentPayments" class="compact-payment">
              <div class="payment-info">
                <div class="payment-name">{{payment.name}}</div>
                <div class="payment-date">{{payment.paidDate | date:'MMM dd'}}</div>
              </div>
              <div class="payment-amount">₹{{payment.amount | number}}</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .fees-container {
      padding: 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      height: 100%;
      overflow-y: auto;
      font-family: 'Inter', sans-serif;
    }
    
    .fees-header {
      margin-bottom: 1.5rem;
      text-align: left;
    }
    
    .page-title {
      font-size: 1.75rem;
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
    
    /* Dashboard Grid Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 1rem;
      height: calc(100vh - 200px);
    }
    
    /* Analytics Card with Circular Progress */
    .analytics-card {
      grid-row: span 2;
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .analytics-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .circular-progress-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .circular-progress {
      position: relative;
    }
    
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    
    .percentage {
      font-size: 1.5rem;
      font-weight: 700;
      color: #10b981;
    }
    
    .label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }
    
    .analytics-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    
    .analytics-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #4b5563;
    }
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .dot.paid { background: #10b981; }
    .dot.pending { background: #f59e0b; }
    .dot.overdue { background: #ef4444; }
    
    /* Summary Mini Cards */
    .summary-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    
    .mini-card {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: transform 0.3s ease;
      border-left: 3px solid;
    }
    
    .mini-card:hover {
      transform: translateY(-2px);
    }
    
    .mini-card.total { border-left-color: #3b82f6; }
    .mini-card.paid { border-left-color: #10b981; }
    .mini-card.pending { border-left-color: #f59e0b; }
    .mini-card.overdue { border-left-color: #ef4444; }
    
    .mini-icon {
      font-size: 1.5rem;
    }
    
    .mini-amount {
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
    }
    
    .mini-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }
    
    /* Breakdown Card */
    .breakdown-card {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    
    .breakdown-card h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }
    
    .fee-items {
      max-height: 250px;
      overflow-y: auto;
    }
    
    .compact-fee-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      border-left: 3px solid;
      transition: all 0.3s ease;
    }
    
    .compact-fee-item:hover {
      background: #f8fafc;
    }
    
    .compact-fee-item.paid {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%);
      border-left-color: #10b981;
    }
    
    .compact-fee-item.pending {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%);
      border-left-color: #f59e0b;
    }
    
    .compact-fee-item.overdue {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%);
      border-left-color: #ef4444;
    }
    
    .fee-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.85rem;
    }
    
    .fee-due {
      font-size: 0.7rem;
      color: #64748b;
    }
    
    .fee-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .fee-amount {
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e293b;
    }
    
    .fee-status-badge {
      font-size: 1rem;
    }
    
    .mini-pay-btn {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 600;
      cursor: pointer;
    }
    
    /* Notifications Card */
    .notifications-card {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    
    .notifications-card h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }
    
    .notification-items {
      max-height: 250px;
      overflow-y: auto;
    }
    
    .compact-notification {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      border-left: 3px solid;
    }
    
    .compact-notification.reminder {
      background: #f0f9ff;
      border-left-color: #3b82f6;
    }
    
    .compact-notification.warning {
      background: #fffbeb;
      border-left-color: #f59e0b;
    }
    
    .compact-notification.success {
      background: #f0fdf4;
      border-left-color: #10b981;
    }
    
    .notification-icon {
      font-size: 1.2rem;
    }
    
    .notification-message {
      font-weight: 500;
      color: #1e293b;
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }
    
    .notification-date {
      font-size: 0.7rem;
      color: #64748b;
    }
    
    /* History Card */
    .history-card {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    
    .history-card h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }
    
    .payment-items {
      max-height: 250px;
      overflow-y: auto;
    }
    
    .compact-payment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border-radius: 8px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%);
      border-left: 3px solid #10b981;
      margin-bottom: 0.5rem;
    }
    
    .payment-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.85rem;
    }
    
    .payment-date {
      font-size: 0.7rem;
      color: #64748b;
    }
    
    .payment-amount {
      font-size: 0.9rem;
      font-weight: 700;
      color: #059669;
    }
    
    /* Responsive Design */
    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      
      .analytics-card {
        grid-column: span 2;
        grid-row: span 1;
      }
      
      .circular-progress-container {
        flex-direction: row;
        gap: 2rem;
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .analytics-card {
        grid-column: span 1;
        grid-row: span 1;
      }
      
      .summary-cards-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .fees-container {
        padding: 0.5rem;
      }
    }
  `]
})
export class FeesComponent {
  studentName = 'Arjun Sharma';
  
  feeItems: FeeItem[] = [
    {
      id: 1,
      name: 'Tuition Fee - Semester 1',
      amount: 45000,
      dueDate: new Date('2024-08-15'),
      status: 'paid',
      paidDate: new Date('2024-08-10'),
      category: 'Academic'
    },
    {
      id: 2,
      name: 'Library Fee',
      amount: 2500,
      dueDate: new Date('2024-09-01'),
      status: 'paid',
      paidDate: new Date('2024-08-28'),
      category: 'Library'
    },
    {
      id: 3,
      name: 'Sports & Activities Fee',
      amount: 5000,
      dueDate: new Date('2024-09-30'),
      status: 'pending',
      category: 'Sports'
    },
    {
      id: 4,
      name: 'Lab Fee - Science',
      amount: 3500,
      dueDate: new Date('2024-10-15'),
      status: 'pending',
      category: 'Laboratory'
    },
    {
      id: 5,
      name: 'Examination Fee',
      amount: 1500,
      dueDate: new Date('2024-09-20'),
      status: 'overdue',
      category: 'Examination'
    },
    {
      id: 6,
      name: 'Transport Fee - Q2',
      amount: 8000,
      dueDate: new Date('2024-09-15'),
      status: 'overdue',
      category: 'Transport'
    }
  ];

  notifications: FeeNotification[] = [
    {
      id: 1,
      message: 'Reminder: Sports & Activities Fee due in 5 days',
      date: new Date('2024-09-25'),
      type: 'reminder',
      feeId: 3
    },
    {
      id: 2,
      message: 'Payment confirmed for Library Fee - ₹2,500',
      date: new Date('2024-08-28'),
      type: 'success',
      feeId: 2
    },
    {
      id: 3,
      message: 'URGENT: Examination Fee is overdue! Please pay immediately',
      date: new Date('2024-09-22'),
      type: 'warning',
      feeId: 5
    },
    {
      id: 4,
      message: 'Transport Fee payment is overdue. Late charges may apply',
      date: new Date('2024-09-18'),
      type: 'warning',
      feeId: 6
    },
    {
      id: 5,
      message: 'New fee structure for Lab Fee has been updated',
      date: new Date('2024-09-20'),
      type: 'reminder',
      feeId: 4
    }
  ];

  get totalFees(): number {
    return this.feeItems.reduce((sum, fee) => sum + fee.amount, 0);
  }

  get paidFees(): number {
    return this.feeItems
      .filter(fee => fee.status === 'paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
  }

  get pendingFees(): number {
    return this.feeItems
      .filter(fee => fee.status === 'pending')
      .reduce((sum, fee) => sum + fee.amount, 0);
  }

  get lateFees(): number {
    return this.feeItems
      .filter(fee => fee.status === 'overdue')
      .reduce((sum, fee) => sum + fee.amount, 0);
  }

  get paidPercentage(): number {
    return Math.round((this.paidFees / this.totalFees) * 100);
  }

  get pendingCount(): number {
    return this.feeItems.filter(fee => fee.status === 'pending').length;
  }

  get overdueCount(): number {
    return this.feeItems.filter(fee => fee.status === 'overdue').length;
  }

  get recentPayments(): FeeItem[] {
    return this.feeItems
      .filter(fee => fee.status === 'paid')
      .sort((a, b) => (b.paidDate?.getTime() || 0) - (a.paidDate?.getTime() || 0));
  }
}