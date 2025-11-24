import {Component, OnInit} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notificationService.service';


@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, RouterLink],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeesComponent implements OnInit {

  
  searchTerm: string = '';
  displayedColumns: string[] = ['name','personalId' ,'department', 'phone', 'email'];

  employees:any[]=[];
  selectedEmployee: any = null;
  filteredEmployees: any[] = [];

  constructor(private router: Router,private employeeService: EmployeeService,private notificationService:NotificationService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
      this.employeeService.loadAllEmployees().subscribe({
          next: data => {
              this.employees = data;
              this.filteredEmployees = [...data];
          },
          error: err => { this.notificationService.show('שגיאה בטעינת עובדים',false) }
      });
  }

  
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    this.filteredEmployees = this.employees.filter(emp => {
      return Object.values(emp)
        .filter((v): v is string => typeof v === 'string')
        .some(v => v.toLowerCase().includes(term));
    });
  }

 
  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
  }

  goToEmployeeDetails(personalId: string) {
    this.router.navigate(['/dashboard/employeeDetails',personalId]);
  }
}
