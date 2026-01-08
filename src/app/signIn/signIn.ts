import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {RegisterService} from '../services/register.service';
import {CommonModule} from '@angular/common';
import { NotificationService } from '../services/notificationService.service';


@Component({
  selector:'app-register',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: 'signIn.html',
  styleUrl: 'signIn.css'
})

export class RegisterComponent {

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword = false;

  constructor(
    private registerService: RegisterService,
    private router:Router,
    private notificationService: NotificationService
  ) {
  }


  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.notificationService.show('הסיסמאות אינן זהות',false);
      return;
    }

    this.registerService.register(this.username,this.email ,this.password).subscribe({

      next: () => {
        this.notificationService.show('נרשמת בהצלחה',true);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.notificationService.show('שגיאה בהרשמה, נסה שוב במועד מאוחר יותר',false);
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
