import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { LastActivity } from '../model';
import { CommonModule } from '@angular/common';
import { NotificationsModalComponent } from './notifications-modal/notifications-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NotificationsModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(NotificationsModalComponent) notificationsModal!: NotificationsModalComponent;

  numberOfEmployees = 0;
  numberOfAttendants = 0;
  monthlySalaryTotal = 10000;
  projectsOnboard = 5;
  notificationCount = 0;
  lastActivities: LastActivity[] = [];

  constructor(private router: Router, private homeService: HomeService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateNotificationCount();
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadLastActivities();
  }

  navigateTo(route: string) {
    this.router.navigate(['/home', route]);
  }

  openNotifications() {
    if (this.notificationsModal) {
      this.notificationsModal.open();
    }
  }

  onNotificationsClose() {
    this.updateNotificationCount();
  }

  updateNotificationCount() {
    if (this.notificationsModal) {
      this.notificationCount = this.notificationsModal.getUnreadCount();
    }
  }

  formatNumber(num: number): string {
    if (!num || num === 0) {
      return '0';
    }
    return num.toLocaleString('he-IL');
  }

  loadStats() {
    this.homeService.loadDashboardStats().subscribe((stats: any) => {
      this.numberOfEmployees = stats.numberOfEmployees;
      this.numberOfAttendants = stats.numberOfAttendants;
    });
  }

  loadLastActivities(): void {
    this.homeService.loadLastActivities().subscribe({
      next: (activities: LastActivity[]) => {
        this.lastActivities = activities;
      }
    });
  }

  getActivityIconType(action: string | undefined): string {

    if (!action) {
      return 'default';
    }

    const upperAction = action.toUpperCase();

    switch(upperAction) {
      case 'ADD':
        return 'add';
      case 'DELETE':
        return 'delete';
      case 'UPDATE':
        return 'edit';
      case 'ARCHIVE':
        return 'delete';
      case 'RESTORE':
        return 'restore';
      default:
        return 'default';
      
    }
    
  }
  getActivityMessage(item: LastActivity) {
    return this.parseActivityMessage(item);
  }
  parseActivityMessage(activity: LastActivity): { label: string; details: string } {
    const action = activity.action.toUpperCase();
    const userName = activity.fromUser;
    const affectedEmployee = activity.affectedEmployee || '';

    const actionLabels: { [key: string]: string } = {
      'ADD': 'הוסיף',
      'DELETE': 'מחק',
      'UPDATE': 'עדכן',
      'ARCHIVE': 'העביר לארכיון',
      'RESTORE': 'שחזר'
    };

    const hebrewAction = actionLabels[action] || action;

    // Return formatted message
    if (affectedEmployee) {
      return {
        label: `${userName} ${hebrewAction}`,
        details: affectedEmployee
      };
    }

    return {
      label: `${userName} ${hebrewAction}`,
      details: ''
    };
  }

  formatRelativeTime(date: string, time: string): string {
    const actionDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = now.getTime() - actionDateTime.getTime();

    if (diffMs < 0) {
      return 'עכשיו';
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'עכשיו';
    }

    if (diffMinutes < 60) {
      if (diffMinutes === 1) {
        return 'לפני דקה';
      }
      if (diffMinutes === 2) {
        return 'לפני שתי דקות';
      }
      return `לפני ${diffMinutes} דקות`;
    }

    if (diffHours < 24) {
      if (diffHours === 1) {
        return 'לפני שעה';
      }
      if (diffHours === 2) {
        return 'לפני שעתיים';
      }
      return `לפני ${diffHours} שעות`;
    }

    if (diffDays < 7) {
      if (diffDays === 1) {
        return 'אתמול';
      }
      if (diffDays === 2) {
        return 'שלשום';
      }
      return `לפני ${diffDays} ימים`;
    }

    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      if (weeks === 1) {
        return 'לפני שבוע';
      }
      return `לפני ${weeks} שבועות`;
    }

    const months = Math.floor(diffDays / 30);
    if (months === 1) {
      return 'לפני חודש';
    }
    return `לפני ${months} חודשים`;
  }
}