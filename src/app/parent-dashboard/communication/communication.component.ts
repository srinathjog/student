import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './communication.component.html',
  styleUrl: './communication.component.scss'
})
export class CommunicationComponent implements OnInit {
  activeTab: string = 'circular';
  
  communicationTabs = [
    { id: 'circular', label: 'Circular/News', icon: '📢' },
    { id: 'mailbox', label: 'Mailbox', icon: '📬' },
    { id: 'sms', label: 'SMS History', icon: '💬' },
    { id: 'achievement', label: 'Achievement', icon: '🏆' },
    { id: 'ptm', label: 'PTM', icon: '👥' },
    { id: 'remarks', label: 'Remarks', icon: '📝' },
    { id: 'reports', label: 'Other Reports', icon: '📊' }
  ];

  // Sample data - replace with API calls
  circulars = [
    {
      id: 1,
      title: 'Winter Break Announcement',
      date: '2024-12-20',
      content: 'School will remain closed from Dec 25 to Jan 5 for winter break. Classes will resume on Jan 6, 2025.',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Annual Sports Day',
      date: '2024-12-18',
      content: 'Annual Sports Day will be held on January 15, 2025. All students are required to participate.',
      isRead: true,
      priority: 'medium'
    }
  ];

  mailboxMessages = [
    {
      id: 1,
      from: 'Ms. Smith (Math Teacher)',
      subject: 'Math Assignment Feedback',
      date: '2024-12-21',
      content: 'Great progress in mathematics this week. Your child has shown excellent improvement in algebra.',
      isRead: false,
      attachment: false
    },
    {
      id: 2,
      from: 'Principal Office',
      subject: 'Parent Meeting Schedule',
      date: '2024-12-20',
      content: 'Parent-teacher meeting is scheduled for December 28, 2024. Please confirm your attendance.',
      isRead: true,
      attachment: true
    }
  ];

  smsHistory = [
    {
      id: 1,
      message: 'Your child has arrived at school safely at 8:15 AM',
      date: '2024-12-21',
      time: '08:15 AM',
      type: 'arrival'
    },
    {
      id: 2,
      message: 'Parent-Teacher Meeting reminder: Tomorrow at 3:00 PM',
      date: '2024-12-20',
      time: '02:30 PM',
      type: 'reminder'
    }
  ];

  achievements = [
    {
      id: 1,
      title: 'Math Competition Winner',
      description: 'First place in inter-school mathematics competition',
      date: '2024-12-15',
      certificate: true,
      category: 'Academic'
    },
    {
      id: 2,
      title: 'Perfect Attendance',
      description: 'Perfect attendance for the month of November',
      date: '2024-11-30',
      certificate: false,
      category: 'Attendance'
    }
  ];

  ptmSchedules = [
    {
      id: 1,
      date: '2024-12-28',
      time: '3:00 PM - 3:30 PM',
      teacher: 'Ms. Smith',
      subject: 'Mathematics',
      status: 'scheduled',
      mode: 'in-person'
    },
    {
      id: 2,
      date: '2024-12-28',
      time: '3:30 PM - 4:00 PM',
      teacher: 'Mr. Johnson',
      subject: 'Science',
      status: 'confirmed',
      mode: 'online'
    }
  ];

  remarks = [
    {
      id: 1,
      teacher: 'Ms. Smith',
      subject: 'Mathematics',
      remark: 'Excellent problem-solving skills. Shows great interest in algebra.',
      date: '2024-12-20',
      type: 'positive'
    },
    {
      id: 2,
      teacher: 'Mr. Davis',
      subject: 'English',
      remark: 'Needs to improve handwriting and focus on grammar exercises.',
      date: '2024-12-18',
      type: 'improvement'
    }
  ];

  otherReports = [
    {
      id: 1,
      title: 'Monthly Progress Report',
      type: 'Academic',
      date: '2024-12-15',
      downloadUrl: '/reports/monthly-progress.pdf',
      size: '2.3 MB'
    },
    {
      id: 2,
      title: 'Attendance Report',
      type: 'Attendance',
      date: '2024-12-10',
      downloadUrl: '/reports/attendance-report.pdf',
      size: '1.1 MB'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Load initial data
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  markAsRead(type: string, id: number): void {
    switch(type) {
      case 'circular':
        const circular = this.circulars.find(c => c.id === id);
        if (circular) circular.isRead = true;
        break;
      case 'mailbox':
        const message = this.mailboxMessages.find(m => m.id === id);
        if (message) message.isRead = true;
        break;
    }
  }

  downloadReport(url: string): void {
    // Implement download functionality
    console.log('Downloading report:', url);
  }

  confirmPTM(id: number): void {
    const ptm = this.ptmSchedules.find(p => p.id === id);
    if (ptm) ptm.status = 'confirmed';
  }
}