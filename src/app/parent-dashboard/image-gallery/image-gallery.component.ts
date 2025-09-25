import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Image Gallery</h1>
      <div class="gallery-content">
        <div class="image-grid">
          <div class="image-item">
            <img src="/uploads/swikrit.jpg" alt="School Event" class="gallery-image">
            <div class="image-caption">Annual Sports Day</div>
          </div>
          <div class="image-item">
            <img src="/uploads/swikrit.jpg" alt="School Event" class="gallery-image">
            <div class="image-caption">Science Fair 2024</div>
          </div>
          <div class="image-item">
            <img src="/uploads/swikrit.jpg" alt="School Event" class="gallery-image">
            <div class="image-caption">Cultural Program</div>
          </div>
          <div class="image-item">
            <img src="/uploads/swikrit.jpg" alt="School Event" class="gallery-image">
            <div class="image-caption">Graduation Ceremony</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../parent-dashboard.component.scss']
})
export class ImageGalleryComponent {
}