import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login.service';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {firstValueFrom} from 'rxjs';


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
  private snackBar: MatSnackBar

  ) {}


  async onLogin() {
    try {
      const response = await firstValueFrom(this.loginService.login(this.username, this.password));
      sessionStorage.setItem('token', response.token);
      this.router.navigate(['/dashboard']);
      this.snackBar.open("ברוך הבא", '', {
        duration: 2000,
        horizontalPosition: "left",
        verticalPosition: "bottom",
        panelClass: ['custom-snackbar']
      });
    } catch (err) {
      this.snackBar.open("שם משתמש או סיסמה שגויים", '', {
        duration: 2000,
        horizontalPosition: "center",
        verticalPosition: "bottom",
        panelClass: ['error-snackbar']
      });
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

}
