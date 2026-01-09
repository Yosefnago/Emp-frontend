import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  type: 'message' | 'event' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.css']
})
export class NotificationsModalComponent {
  @Output() close = new EventEmitter<void>();

  isVisible = false;

  notifications: Notification[] = [
    {
      id: 1,
      type: 'message',
      title: 'הודעה חדשה',
      message: 'יש לך הודעה חדשה מעובד',
      time: 'לפני 5 דקות',
      read: false
    },
    {
      id: 2,
      type: 'event',
      title: 'אירוע קרוב',
      message: 'פגישת צוות מחר בשעה 10:00',
      time: 'לפני שעה',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      title: 'התראה',
      message: 'נדרשת אישור בקשת חופשה',
      time: 'לפני 3 שעות',
      read: true
    }
  ];

  open() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }

  markAsRead(notification: Notification) {
    notification.read = true;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  deleteNotification(notification: Notification) {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  clearAll() {
    this.notifications = [];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getIconClass(type: string): string {
    return `notification-icon-${type}`;
  }
}