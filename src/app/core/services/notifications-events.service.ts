// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppNotification } from '../models/AppNotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsEventsService {
  private apiUrl = 'http://localhost:8090/notifications';

  constructor(private http: HttpClient) {}

  // Get all notifications for current user
  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.apiUrl);
  }

  // Get unread count
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }

  // Mark notification as read
  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {});
  }

  // Mark all as read
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {});
  }

  // Delete notification
  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Clear all notifications
  clearAll(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear-all`);
  }
}