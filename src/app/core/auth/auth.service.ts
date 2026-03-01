import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

/**
 * Authentication service that manages user authentication and tokens.
 * Handles login, logout, token refresh, and token expiration checking.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = 'http://localhost:8090/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {

    return this.http.post<{ token: string; accessToken: string; username: string }>(

      `${this.API_URL}/login`,
      { username, password },
      { withCredentials: true }
    );
  }

  refresh(): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/refresh`,
      {},
      { withCredentials: true }
    );
  }

  logout(): void {
    this.http.post<void>(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .subscribe({ 
        next: () => this.clearSession(),
        error: () => this.clearSession() 
      });
  }

  clearSession(): void {
    sessionStorage.clear();
    location.href = '/login';
  }
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('username');
  }
  
}
