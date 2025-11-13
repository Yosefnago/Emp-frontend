import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { NotificationService } from '../../services/notificationService.service';
import { AddEmployeeRequest, EmployeeService } from '../../services/employee.service';



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

  firstName = '';
  lastName = '';
  personalId = '';
  phone = '';
  department = '';
  address = '';
  email = '';
  position = '';
  hireDate = '';

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) { }

  saveEmployee(): void {
    const request: AddEmployeeRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      personalId: this.personalId,
      phone: this.phone,
      email: this.email,
      department: this.department,
      address: this.address,
      position: this.position,
      hireDate: this.hireDate
    };

    this.employeeService.addEmployee(request).subscribe({
      next: () => {
        this.notificationService.show('עובד נוסף בהצלחה', true);
        this.resetFileds();
      },
      error: () => {
        this.notificationService.show('שגיאה בהוספת עובד', false);
      }
    });
  }
  resetFileds(){
    this.firstName = '';
    this.lastName = '';
    this.personalId = '';
    this.phone = '';
    this.department = '';
    this.address = '';
    this.email = '';
    this.position = '';
    this.hireDate = '';
  }
}