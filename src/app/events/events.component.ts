// events.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  activeTab: string = 'upcoming';
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];

  newEvent = {
    title: '',
    date: '',
    time: '',
    description: '',
    location: '',
    attendees: null,
    priority: 'MEDIUM'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const allEvents = [
      {
        id: 1,
        title: 'מיטינג פיתוח פרויקט',
        date: new Date(2025, 0, 15),
        time: '10:00',
        description: 'דיון על התקדמות הפרויקט והתכניות הבאות',
        location: 'חדר ישיבות 1',
        attendees: 8,
        priority: 'HIGH',
        summary: ''
      },
      {
        id: 2,
        title: 'הכשרה ביטחון מידע',
        date: new Date(2025, 0, 18),
        time: '14:00',
        description: 'הכשרת עובדים בנושא ביטחון מידע וסיסמאות',
        location: 'אודיטוריום',
        attendees: 50,
        priority: 'MEDIUM',
        summary: ''
      },
      {
        id: 3,
        title: 'חגיגת סיום שנה',
        date: new Date(2025, 0, 25),
        time: '18:00',
        description: 'אירוע חגיגי לסיום שנת העבודה',
        location: 'מטבח',
        attendees: 100,
        priority: 'LOW',
        summary: ''
      },
      {
        id: 4,
        title: 'סקירת Q1',
        date: new Date(2025, 1, 5),
        time: '09:00',
        description: 'סקירת תוכניות ויעדים לרבעון הראשון',
        location: 'חדר דירקטוריון',
        attendees: 15,
        priority: 'HIGH',
        summary: ''
      },
      {
        id: 5,
        title: 'יום קידום מוצרים חדשים',
        date: new Date(2025, 1, 10),
        time: '11:00',
        description: 'הצגת מוצרים חדשים לחברות',
        location: 'אולם A',
        attendees: 200,
        priority: 'MEDIUM',
        summary: ''
      },
      {
        id: 6,
        title: 'כנס מנהלים',
        date: new Date(2024, 11, 20),
        time: '09:00',
        description: 'כנס שנתי של מנהלי חברה',
        location: 'מלון בתל אביב',
        attendees: 30,
        priority: 'HIGH',
        summary: 'דיון על ביצועי 2024 ותוכניות ל-2025'
      },
      {
        id: 7,
        title: 'חידוש רישיון עובדים',
        date: new Date(2024, 11, 15),
        time: '14:00',
        description: 'הליך חידוש רישיונות ותעודות',
        location: 'משרדים',
        attendees: 0,
        priority: 'MEDIUM',
        summary: 'הושלמו כל החידושים בהצלחה'
      },
      {
        id: 8,
        title: 'אירוע חנוכה',
        date: new Date(2024, 11, 26),
        time: '17:00',
        description: 'חגיגת חנוכה עם עובדים וחברים',
        location: 'מטבח',
        attendees: 80,
        priority: 'LOW',
        summary: 'אירוע מוצלח עם השתתפות גבוהה'
      }
    ];

    const now = new Date(2025, 0, 10);

    this.upcomingEvents = allEvents
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.pastEvents = allEvents
      .filter(event => new Date(event.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'create') {
      this.resetForm();
    }
  }

  createEvent(): void {
    if (this.newEvent.title && this.newEvent.date && this.newEvent.time) {
      const event = {
        id: Math.max(...this.upcomingEvents.map(e => e.id), 0) + 1,
        title: this.newEvent.title,
        date: new Date(this.newEvent.date),
        time: this.newEvent.time,
        description: this.newEvent.description,
        location: this.newEvent.location,
        attendees: this.newEvent.attendees || 0,
        priority: this.newEvent.priority,
        summary: ''
      };

      this.upcomingEvents.push(event);
      this.upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.resetForm();
      this.activeTab = 'upcoming';
    }
  }

  resetForm(): void {
    this.newEvent = {
      title: '',
      date: '',
      time: '',
      description: '',
      location: '',
      attendees: null,
      priority: 'MEDIUM'
    };
  }

  editEvent(id: number): void {
    alert(`עריכת אירוע ${id} - פונקציה זו תיושם בעתיד`);
  }

  getMonthName(date: Date): string {
    const monthNames = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספט', 'אוקטובר', 'נובמבר', 'דצמבר'];
    return monthNames[date.getMonth()];
  }

  translatePriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'HIGH': 'דחוף',
      'MEDIUM': 'בינוני',
      'LOW': 'רגיל'
    };
    return priorityMap[priority] || priority;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}