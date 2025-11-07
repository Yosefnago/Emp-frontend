import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-add-employee',
  templateUrl: `addemployee.html`,
  styleUrls: ['addemployee.css'],
  standalone: true,

  imports: [
    FormsModule
  ]
})
export class AddEmployeeComponent  {

  private apiUrl = 'http://localhost:8090/employees/add';
  private token: string = '';

  employeeName = '';
  employeeId = '';
  employeePhone = '';
  employeeDepartment = '';
  employeeAddress = '';
  employeeEmail = '';

  constructor(private http: HttpClient,private snackBar: MatSnackBar) { }

  addEmployee(
    employeeName:string,
    employeeId:string,
    employeePhone:string,
    employeeDepartment:string,
    employeeAddress:string,
    employeeEmail:string
    ):Observable<any> {

    this.token = sessionStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl,
      {
        name: employeeName,
        personalId: employeeId,     // ✅ personalId בדיוק כמו ב-Java, לא employeeId
        phone: employeePhone,
        department: employeeDepartment,
        address: employeeAddress,
        email: employeeEmail
      },
      { headers, responseType: 'text' }
    );


  }
  saveEmployee(): void {
    this.addEmployee(
      this.employeeName,
      this.employeeId,
      this.employeePhone,
      this.employeeDepartment,
      this.employeeAddress,
      this.employeeEmail
    ).subscribe({
      next: res => {
        this.snackBar.open(" עובד נוסף בהצלחה", '', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
      },
      error: err => {
        this.snackBar.open(" שגיאה בשמירה: " + err.message, '', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
