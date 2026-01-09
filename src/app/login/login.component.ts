import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import { NotificationService } from '../services/notificationService.service';
import { WebSocketService } from '../services/web-socket.service';

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

  constructor(
    private loginService: LoginService,
    private router: Router,
    private notificationService: NotificationService,
    private wsService: WebSocketService

  ) {}


  async onLogin() {
    
    if(!this.username || !this.password){
        this.notificationService.show('נא למלא את השדות בהתאם',false);
        return;
    } 
    try {

      const response = await firstValueFrom(this.loginService.login(this.username, this.password));

      const token = response.token;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('username', this.username);
      this.wsService.connect(token);

      this.router.navigate(['/home']);
      this.notificationService.show('התחברת בהצלחה' ,true);
    
    } catch (err) {
      this.notificationService.show('שם משתמש או סיסמא שגויים',false);
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

}
