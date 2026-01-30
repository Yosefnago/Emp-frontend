import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8090/auth/login'
  private api = 'http://localhost:8090/auth'

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }
  logout(): Observable<void> {
    return this.http.post<void>(`${this.api}/logout`, {});
  }
  clearSession(): void {
    sessionStorage.clear();
  }
}
