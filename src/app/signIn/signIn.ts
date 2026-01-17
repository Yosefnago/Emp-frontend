import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterService} from '../services/register.service';
import {CommonModule} from '@angular/common';
import {SystemMessages } from '../services/systemMessagesService';


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
    private systemService: SystemMessages 
  ) {
  }


  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.systemService.show('הסיסמאות אינן זהות',false);
      return;
    }

    this.registerService.register(this.username,this.email ,this.password).subscribe({

      next: () => {
        this.systemService.show('נרשמת בהצלחה',true);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.systemService.show('שגיאה בהרשמה, נסה שוב במועד מאוחר יותר',false);
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
