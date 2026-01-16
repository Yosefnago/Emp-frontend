export interface AppNotification {
  id: number;
  message: string;
  type: 'EVENT_REMINDER' | 'EVENT_TODAY' | 'BIRTHDAY_REMINDER';
  isRead: boolean;
  createdAt: string;
}