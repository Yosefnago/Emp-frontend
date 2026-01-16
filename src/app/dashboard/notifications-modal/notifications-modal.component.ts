import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsEventsService } from '../../services/NotificationsEventsService';
import { AppNotification } from '../../models/AppNotification';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.css']
})
export class NotificationsModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  isVisible = false;
  notifications: AppNotification[] = [];

  constructor(private noteService: NotificationsEventsService) {}

  ngOnInit() {
    this.loadNotifications();
    this.getUnreadCount();
  }

  loadNotifications() {
    this.noteService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      }
    });
  }

  open() {
    this.isVisible = true;
    this.loadNotifications(); // Refresh when opening
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }

  markAsRead(notification: AppNotification) {
    this.noteService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
      }
    });
  }

  markAllAsRead() {
    this.noteService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
      }
    });
  }

  deleteNotification(notification: AppNotification) {
    this.noteService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      }
    });
  }

  clearAll() {
    this.noteService.clearAll().subscribe({
      next: () => {
        this.notifications = [];
      }
    });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      'EVENT_REMINDER': 'notification-icon-event',
      'EVENT_TODAY': 'notification-icon-event',
      'BIRTHDAY_REMINDER': 'notification-icon-alert'
    };
    return iconMap[type] || 'notification-icon-message';
  }

  getNotificationType(type: string): 'message' | 'event' | 'alert' {
    if (type === 'EVENT_REMINDER' || type === 'EVENT_TODAY') {
      return 'event';
    }
    if (type === 'BIRTHDAY_REMINDER') {
      return 'alert';
    }
    return 'message';
  }
}