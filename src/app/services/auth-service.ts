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

    constructor(private http: HttpClient) {}

    login(username: string,password: string): Observable<String> {

        return this.http.post<{token:string; accessToken:string; username: string}>(

            `${this.API_URL}/login`,
            {username,password},
            {withCredentials: true}

        ).pipe(
            map(response => {
                const token = response.accessToken || response.token;
                
                if (!token) {
                    throw new Error('No token received from server');
                }
                
                this.setAccessToken(token);
              
                return token;
            })
        );
    }

  /**
   * Refreshes the access token using the refresh token stored in HTTP-only cookie.
   * The refresh token is automatically sent by the browser via withCredentials.
   * 
   * @returns Observable with new access token
   */
  refresh(): Observable<string> {

    return this.http.post<{ accessToken: string }>(

      `${this.API_URL}/refresh`,
      {},
      { withCredentials: true } 

    ).pipe(

      map(response => {
        this.setAccessToken(response.accessToken);
        return response.accessToken;

      })
    
    );
  }

  /**
   * Logs out the user by clearing session storage and redirecting to login.
   * Also calls backend to clear the refresh token cookie.
   */
  logout(): void {
    
    this.http.post<void>(
      `${this.API_URL}/logout`,
      {},
      { withCredentials: true }

    );
    this.clearSession();
  }
  /**
   * Clears the session and redirects to login page.
   * This is used both for logout and when refresh token fails.
   */
  clearSession(): void {
    sessionStorage.clear();
    location.href = '/login';
  }
  /**
   * Stores the access token in session storage.
   * 
   * @param token JWT access token
   */
  private setAccessToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }
  /**
   * Retrieves the access token from session storage.
   * 
   * @returns access token string or null if not found
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  /**
   * Checks if an access token exists in session storage.
   * 
   * @returns true if token exists, false otherwise
   */
  hasAccessToken(): boolean {
    return this.getAccessToken() !== null;
  }
}
