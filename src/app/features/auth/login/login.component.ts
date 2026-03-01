import { Component, DestroyRef, inject } from '@angular/core'; // חדש: הוספת DestroyRef
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // חדש: אופרטור מניעת זליגות זיכרון
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

  private destroyRef = inject(DestroyRef); 

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private systemService: SystemMessages,
    private webSocketService: WebSocketService
  ) { }

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
      const loginResponse = await firstValueFrom(
        this.loginService.login(this.username, this.password)
      );

      sessionStorage.setItem('username', loginResponse.username || this.username);
      
      sessionStorage.setItem('role', loginResponse.role);

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

  private connectWebSocket(): void {
    try {
      if (this.webSocketService.isConnected) {
        return;
      }

      this.webSocketService.connect();

      this.webSocketService.connectionStatus
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (status) => {
            if (status.error) {
              console.error('WebSocket connection error:', status.error);
            }
          },
          error: (error) => {
            console.error('WebSocket subscription error:', error);
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