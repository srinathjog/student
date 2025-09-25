import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, DatePipe, HttpClientModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnChanges {
  @Input() className: string = '';
  events: any[] = [];
  today: Date = new Date();
  month: number = this.today.getMonth();
  year: number = this.today.getFullYear();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['className'] && !changes['className'].firstChange) {
      this.fetchEvents();
    }
  }

  fetchEvents() {
    if (!this.className) return;
    const monthStr = String(this.month + 1).padStart(2, '0');
  this.http.get<any[]>(`${environment.apiBaseUrl}/calendar-events?month=${monthStr}&year=${this.year}&class=${this.className}`)
      .subscribe(
        (data) => { this.events = data; },
        (error) => { this.events = []; }
      );
  }

  get monthName(): string {
    return this.today.toLocaleString('default', { month: 'long' });
  }

  get daysInMonth(): number {
    return new Date(this.year, this.month + 1, 0).getDate();
  }

  get firstDayOfWeek(): number {
    return new Date(this.year, this.month, 1).getDay();
  }

  get calendarDays(): Array<{date: Date, isToday: boolean, hasEvent: boolean}> {
    const days: Array<{date: Date, isToday: boolean, hasEvent: boolean}> = [];
    const total = this.daysInMonth;
    for (let i = 1; i <= total; i++) {
      const date = new Date(this.year, this.month, i);
      const isToday = date.toDateString() === this.today.toDateString();
      const hasEvent = (this.events || []).some(ev => {
        const evDate = new Date(ev.date);
        return evDate.toDateString() === date.toDateString();
      });
      days.push({ date, isToday, hasEvent });
    }
    return days;
  }
}
