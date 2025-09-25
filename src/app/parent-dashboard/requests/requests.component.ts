import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Requests</h1>
      <div class="requests-content">
        <div class="request-form">
          <h3 class="text-xl font-semibold mb-4">Submit New Request</h3>
          <form class="request-form-fields" (ngSubmit)="onSubmitRequest()">
            <div class="form-group">
              <label for="requestType">Request Type</label>
              <select id="requestType" class="form-control" [(ngModel)]="newRequest.type" name="requestType">
                <option value="">Select request type</option>
                <option value="leave">Leave Application</option>
                <option value="transport">Transport Request</option>
                <option value="fee">Fee Related</option>
                <option value="academic">Academic Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="requestMessage">Message</label>
              <textarea id="requestMessage" class="form-control" rows="4" 
                        [(ngModel)]="newRequest.message" name="requestMessage"
                        placeholder="Enter your request details..."></textarea>
            </div>
            <button type="submit" class="btn-primary">Submit Request</button>
          </form>
        </div>
        
        <div class="request-history">
          <h3 class="text-xl font-semibold mb-4 mt-8">Previous Requests</h3>
          <div class="request-list">
            <div class="request-item" *ngFor="let request of requests">
              <div class="request-header">
                <span class="request-type">{{ request.type }}</span>
                <span class="request-date">{{ request.date }}</span>
              </div>
              <div class="request-message">{{ request.message }}</div>
              <div class="request-status" [ngClass]="request.status">{{ request.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../parent-dashboard.component.scss']
})
export class RequestsComponent {
  newRequest = {
    type: '',
    message: ''
  };

  requests = [
    {
      type: 'Leave Application',
      date: 'Dec 20, 2024',
      message: 'Request for leave on Dec 25-26 for family function',
      status: 'approved'
    },
    {
      type: 'Transport Request',
      date: 'Dec 18, 2024',
      message: 'Request to change pickup location to new address',
      status: 'pending'
    }
  ];

  onSubmitRequest() {
    if (this.newRequest.type && this.newRequest.message) {
      const request = {
        ...this.newRequest,
        date: new Date().toLocaleDateString(),
        status: 'pending'
      };
      this.requests.unshift(request);
      this.newRequest = { type: '', message: '' };
    }
  }
}