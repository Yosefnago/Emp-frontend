import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {SystemMessages } from '../services/systemMessagesService';
import { WebSocketService } from '../services/web-socket.service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword = false;
  isLoggingIn = false;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private systemService: SystemMessages,
    private webSocketService: WebSocketService
  ) {}


  /**
   * Handles user login flow.
   * Validates input, authenticates with backend, stores token, and establishes WebSocket connection.
   */
  async onLogin() {
    
    // Validate form inputs
    if (!this.username || !this.password) {
      this.systemService.show('נא למלא את השדות בהתאם', false);
      return;
    }

    // Prevent multiple login attempts
    if (this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = true;

    try {
      // Authenticate with backend
      // The new auth system returns { accessToken: string, username: string }
      // The refresh token is automatically set in an HTTP-only cookie
      const accessToken = await firstValueFrom(
        this.loginService.login(this.username, this.password)
      );

      // Token is already stored by AuthService.login()
      // But we also store username for easy access
      sessionStorage.setItem('username', this.username);

      // Navigate to home page
      this.router.navigate(['/home']);

      // Show success message
      this.systemService.show('התחברת בהצלחה', true);

      // Establish WebSocket connection with the access token
      // This must happen AFTER navigation to avoid component lifecycle issues
      setTimeout(() => {
        this.connectWebSocket();
      }, 100);

    } catch (err: any) {
      console.error('Login error:', err);

      // Provide user-friendly error messages based on error type
      let errorMessage = 'שם משתמש או סיסמא שגויים';

      // Check for specific error codes from backend
      if (err.error?.error === 'invalid_credentials') {
        errorMessage = 'שם משתמש או סיסמא שגויים';
      } else if (err.status === 0) {
        // Network error (server not reachable)
        errorMessage = 'שגיאת חיבור לשרת';
      } else if (err.status >= 500) {
        // Server error
        errorMessage = 'שגיאת שרת, נסה שוב מאוחר יותר';
      }

      this.systemService.show(errorMessage, false);

    } finally {
      this.isLoggingIn = false;
    }
  }
  /**
   * Establishes WebSocket connection after successful login.
   * The WebSocketService will automatically handle token refresh and reconnection.
   */
  private connectWebSocket(): void {
    try {
      // Check if already connected to avoid duplicate connections
      if (this.webSocketService.isConnected) {
        console.log('WebSocket already connected');
        return;
      }

      // Connect to WebSocket
      // The service will get the current access token from AuthService
      this.webSocketService.connect();

      // Subscribe to connection status for debugging/monitoring
      this.webSocketService.connectionStatus.subscribe(status => {
        if (status.connected) {
          console.log('WebSocket connected successfully');
        } else if (status.error) {
          console.error('WebSocket connection error:', status.error);
          // Optionally show error to user
          // this.systemService.show('שגיאת חיבור לשרת בזמן אמת', false);
        }
      });

    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      // Don't show error to user - WebSocket is not critical for login
      // The service will automatically retry connection
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

}
