import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {RegisterService} from '../register.service';
import {CommonModule} from '@angular/common';


@Component({
  selector:'app-register',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: 'signIn.html',
  styleUrl: 'signIn.css'
})

export class RegisterComponent {

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword = false;

  constructor(
    private registerService: RegisterService,
    private router:Router,
    private snackBar:MatSnackBar
  ) {
  }


  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('הסיסמאות אינן תואמות', '', {
        duration: 2000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
      return;
    }

    this.registerService.register(this.username, this.password).subscribe({
      next: (response) => {
        this.snackBar.open('נרשמת בהצלחה', '', {
          duration: 2000,
          horizontalPosition: 'left',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open('שגיאה בהרשמה', '', {
          duration: 2000,
          horizontalPosition: 'left',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
      }
    });
  }

}
