import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { NotificationService } from '../services/notificationService.service';
import { AddEmployeeModalComponent } from './add-employee-modal-component/add-employee-modal-component';

interface Employee {
  id: number;
  name: string;
  idNumber: string;
  email: string;
  phone: string;
  department: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'vacation';
  selected?: boolean;
}

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

  constructor(private empService: EmployeeService,private notifService: NotificationService) {}
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
        phone: emp.phone,
        department: emp.department,
        attendanceStatus: emp.status
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
        emp.phone.includes(query) ||
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
    console.log(`${selectedCount} employees selected`);
  }

  viewEmployee(employee: Employee) {
    
    this.empService.loadEmployee(employee.idNumber).subscribe(data => {
      this.notifService.show('Employee details loaded successfully.',true);
    });
    
  }

  editEmployee(employee: Employee) {
    
    this.empService.loadEmployee(employee.idNumber).subscribe(data => {
      this.notifService.show('Employee data loaded for editing.',true);
    });
  }

  deleteEmployee(employee: Employee) {
    this.empService.deleteEmployee(employee.idNumber).subscribe(() => {
      this.notifService.show('Employee deleted successfully.',true);
      this.loadEmployees();
    });
  }
}
