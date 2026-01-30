import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {SystemMessages } from '../services/systemMessagesService';
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
    private systemService: SystemMessages,
  ) {}


  async onLogin() {
    
    if(!this.username || !this.password){
        this.systemService.show('נא למלא את השדות בהתאם',false);
        return;
    } 
    try {

      const response = await firstValueFrom(this.loginService.login(this.username, this.password));

      const token = response.token;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('username', this.username);

      this.router.navigate(['/home']);
      this.systemService.show('התחברת בהצלחה' ,true);
    
    } catch (err) {
      this.systemService.show('שם משתמש או סיסמא שגויים',false);
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

}
