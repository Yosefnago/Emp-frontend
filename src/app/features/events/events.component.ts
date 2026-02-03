// events.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../core/services/events.service';

export interface EventDto {
  eventName: string;
  eventDate: string;
  eventTime: string;
  priority: string;
  description: string;
  location: string;
  numberOfAttendance: number;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  activeTab: 'upcoming' | 'past' | 'create' = 'upcoming';

  upcomingEvents: EventDto[] = [];
  pastEvents: EventDto[] = [];

  private allEvents: EventDto[] = [];

  newEvent: EventDto = {
    eventName: '',
    eventDate: '',
    eventTime: '',
    priority: 'MEDIUM',
    description: '',
    location: '',
    numberOfAttendance: 0
  };

  constructor(
    private router: Router,
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.splitEvents();
      },
      error: (err) => {
        console.error('Failed to load events', err);
      }
    });
  }

  private splitEvents(): void {
    const now = new Date();

    this.upcomingEvents = this.allEvents
      .filter(e => this.toDateTime(e) >= now)
      .sort((a, b) => this.toDateTime(a).getTime() - this.toDateTime(b).getTime());

    this.pastEvents = this.allEvents
      .filter(e => this.toDateTime(e) < now)
      .sort((a, b) => this.toDateTime(b).getTime() - this.toDateTime(a).getTime());
  }
  private toDateTime(e: EventDto): Date {
    return new Date(`${e.eventDate}T${e.eventTime}`);
  }
  switchTab(tab: 'upcoming' | 'past' | 'create'): void {
    this.activeTab = tab;
  }

  getMonthName(dateStr: string): string {
    const date = new Date(dateStr);
    const months = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
    return months[date.getMonth()];
  }

  translatePriority(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'דחוף';
      case 'MEDIUM': return 'בינוני';
      case 'LOW': return 'רגיל';
      default: return priority;
    }
  }

  editEvent(eventName: string): void {

  }

  createEvent(): void {
    this.eventsService.createEvent(this.newEvent).subscribe({
      next: () => {
        this.resetForm();
        this.loadEvents();
        this.activeTab = 'upcoming';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
  resetForm(): void {
    this.newEvent = {
      eventName: '',
      eventDate: '',
      eventTime: '',
      priority: 'MEDIUM',
      description: '',
      location: '',
      numberOfAttendance: 0
    };
  }
}