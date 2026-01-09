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
  numberOfAttendants = 15;
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
    });
  }

  loadLastActivities(): void {
    this.homeService.loadLastActivities().subscribe({
      next: (activities: LastActivity[]) => {
        this.lastActivities = activities;
      }
    });
  }

  getActivityIconType(action: string): string {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('add') || lowerAction.includes('create')) {
      return 'add';
    }
    if (lowerAction.includes('update') || lowerAction.includes('edit')) {
      return 'edit';
    }
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
      return 'delete';
    }
    if (lowerAction.includes('approve')) {
      return 'approve';
    }
    return 'default';
  }

  parseActivityMessage(activity: LastActivity): { label: string; details: string } {
    const action = activity.action.toLowerCase();
    const userName = activity.fromUser;
    let employeeName = '';

    if (action.includes('add new employee')) {
      const parts = activity.action.split('add new employee');
      if (parts.length > 1) {
        employeeName = parts[1].trim();
      }
    } else if (action.includes('added new employee')) {
      const parts = activity.action.split('added new employee');
      if (parts.length > 1) {
        employeeName = parts[1].trim();
      }
    }

    if (action.includes('add') && action.includes('employee')) {
      return {
        label: `${userName} הוסיף עובד חדש`,
        details: employeeName || ''
      };
    }

    if (action.includes('update') && action.includes('employee')) {
      return {
        label: `${userName} עדכן עובד`,
        details: employeeName || ''
      };
    }

    if (action.includes('delete') && action.includes('employee')) {
      return {
        label: `${userName} מחק עובד`,
        details: employeeName || ''
      };
    }

    if (action.includes('approve')) {
      return {
        label: `${userName} אישר`,
        details: ''
      };
    }

    return {
      label: `${userName}`,
      details: activity.action
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