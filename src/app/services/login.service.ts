import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AuthService) {}
  
  /**
   * Authenticates user with username and password.
   * Delegates to AuthService for actual authentication.
   * 
   * @param username user's username
   * @param password user's password
   * @returns Observable with authentication response
   */
  login(username: string, password: string): Observable<any> {
    return this.authService.login(username, password);
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Clears the session storage.
   */
  clearSession(): void {
    this.authService.clearSession();
  }
}
