import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Transport</h1>
      <div class="transport-content">
        <div class="bus-info">
          <div class="bus-card">
            <h3 class="bus-route">Route 15</h3>
            <div class="bus-details">
              <p><strong>Driver:</strong> John Smith</p>
              <p><strong>Phone:</strong> +1 234-567-8900</p>
              <p><strong>Pickup Time:</strong> 7:30 AM</p>
              <p><strong>Drop Time:</strong> 3:45 PM</p>
              <p><strong>Pickup Location:</strong> Main Street Bus Stop</p>
            </div>
            <div class="bus-status">On Time</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../parent-dashboard.component.scss']
})
export class TransportComponent {
}