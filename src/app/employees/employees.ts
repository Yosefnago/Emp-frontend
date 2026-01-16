import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { NotificationService } from '../services/notificationService.service';
import { AddEmployeeModalComponent } from './add-employee-modal-component/add-employee-modal-component';
import { Router } from '@angular/router';
import { Employee } from '../models/Employee';


@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEmployeeModalComponent],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild(AddEmployeeModalComponent) addEmployeeModal!: AddEmployeeModalComponent;
  
  employees: Employee[] = [];
  allEmployees: Employee[] = []; 
  totalEmployees = 0;
  activeEmployees = 0;
  inactiveEmployees = 0;
  currentPage = 1;
  totalPages = 1;
  isSearchExpanded = false;
  searchQuery = '';
  isEmployeeArchiveModalOpen = false;
   private employeeToArchive: Employee | null = null;

  constructor(private empService: EmployeeService,private notifService: NotificationService,private router: Router) {}
  ngOnInit() {
    
    this.loadEmployees();
  }

  loadEmployees() {

    this.empService.loadAllEmployees().subscribe((data: any[]) => {
      
      this.employees = data.map(emp => ({
        id: emp.id,
        name: emp.firstName.concat(' ',emp.lastName),
        idNumber: emp.personalId,
        email: emp.email,
        phoneNumber: emp.phoneNumber,
        department: emp.department,
        attendanceStatus: emp.statusAttendance
      }));

      this.allEmployees = [...this.employees]; 
      this.updateStats();
    });
  }

  openAddEmployeeModal() {
    this.addEmployeeModal.open();
  }
  onModalClose() {
    this.loadEmployees
  }

  onEmployeeAdded(employeeData: any) {
    this.empService.addEmployee(employeeData).subscribe(() => {
      this.notifService.show('Employee added successfully.',true);
      this.loadEmployees();
    }), () => {
      this.notifService.show('Failed to add employee.',false);
    }
    
  }

  toggleSearch() {
    this.isSearchExpanded = !this.isSearchExpanded;
    
    if (this.isSearchExpanded) {
      
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 100);
    } else {
      
      this.searchQuery = '';
      this.employees = [...this.allEmployees];
      this.updateStats();
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.employees = [...this.allEmployees];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.employees = this.allEmployees.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.phoneNumber.includes(query) ||
        emp.idNumber.includes(query) ||
        emp.department.toLowerCase().includes(query)
      );
    }
    this.updateStats();
  }

  updateStats() {
    this.totalEmployees = this.employees.length;
    this.activeEmployees = this.employees.filter(e => 
      e.attendanceStatus === 'present' || e.attendanceStatus === 'late'
    ).length;
    this.inactiveEmployees = this.employees.filter(e => 
      e.attendanceStatus === 'absent' || e.attendanceStatus === 'vacation'
    ).length;
  }

  getInitials(name: string): string {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return name.charAt(0);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      present: 'נוכח',
      absent: 'נעדר',
      late: 'איחור',
      vacation: 'חופשה'
    };
    return statusMap[status] || status;
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.employees.forEach(emp => emp.selected = checked);
  }

  onRowSelect() {
    const selectedCount = this.employees.filter(e => e.selected).length;
  }

  viewEmployeeDetails(personalId: string): void {
    this.router.navigate(['/home/employees/details'], {
      queryParams: { id: personalId }
    });
  }

  deleteEmployee(employee: Employee) {
    this.employeeToArchive = employee;
    this.isEmployeeArchiveModalOpen = true;
  }
  closeEmployeeArchiveModal() {
    this.isEmployeeArchiveModalOpen = false;
    this.employeeToArchive = null;
  }
  confirmArchive(){
    if (!this.employeeToArchive) {
      return;
    }

      this.empService.deleteEmployee(this.employeeToArchive.idNumber).subscribe(
        () => {
          this.notifService.show(`${this.employeeToArchive?.name} הועבר לארכיון בהצלחה.`, true);
          this.closeEmployeeArchiveModal();
          this.loadEmployees();
        },
        () => {
          this.notifService.show('נכשל העברת העובד לארכיון.', false);
          this.closeEmployeeArchiveModal();
        }
      );
    }
}
