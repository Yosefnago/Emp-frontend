import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/auth/login.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SystemMessages } from '../../../core/services/system-messages.service';
import { WebSocketService } from '../../../core/services/web-socket.service';
import { AuthService } from '../../../core/auth/auth.service';

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
  ) { }


  /**
   * Handles user login flow.
   * Validates input, authenticates with backend, stores token, and establishes WebSocket connection.
   */
  async onLogin() {

    if (!this.username || !this.password) {
      this.systemService.show('נא למלא את השדות בהתאם', false);
      return;
    }

    if (this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = true;

    try {

      const accessToken = await firstValueFrom(
        this.loginService.login(this.username, this.password)
      );

      sessionStorage.setItem('username', this.username);

      this.router.navigate(['/home']);

      this.systemService.show('התחברת בהצלחה', true);

      setTimeout(() => {
        this.connectWebSocket();
      }, 100);

    } catch (err: any) {
      console.error('Login error:', err);

      let errorMessage = 'שם משתמש או סיסמא שגויים';

      if (err.error?.error === 'invalid_credentials') {
        errorMessage = 'שם משתמש או סיסמא שגויים';
      } else if (err.status === 0) {
        errorMessage = 'שגיאת חיבור לשרת';
      } else if (err.status >= 500) {
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
      if (this.webSocketService.isConnected) {
        console.log('WebSocket already connected');
        return;
      }

      this.webSocketService.connect();

      this.webSocketService.connectionStatus.subscribe(status => {
        if (status.connected) {
          console.log('WebSocket connected successfully');
        } else if (status.error) {
          console.error('WebSocket connection error:', status.error);
        }
      });

    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

}
