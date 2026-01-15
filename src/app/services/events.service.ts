import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventDto {
  eventName: string;
  eventDate: string;
  eventTime: string;
  priority: string;
  description: string;
  location: string;
  numberOfAttendance: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private readonly apiUrl = 'http://localhost:8090/events';

  constructor(private http: HttpClient) {}

  getUpcomingEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.apiUrl}`);
  }
  createEvent(event: EventDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, event);
  }
}