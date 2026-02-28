// department.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../core/services/department.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  selectedDepartment: any = null;
  department: any = null;
  departments: string[] = ['פיתוח', 'משאבי אנוש', 'מכירות', 'שיווק', 'תמיכה', 'ניהול', 'כספים'
  ];

  constructor(private router: Router, private departmentService: DepartmentService) { }

  ngOnInit(): void {
    
  }

  onDepartmentChange(): void {
    if(this.selectedDepartment === null || this.selectedDepartment ===' '){
      this.department = null;
      return;
    }
    const departmentName = this.renameDepartment(this.selectedDepartment);
    
    this.departmentService.getDepartmentDetails(departmentName).subscribe({
      next: (data) => {
        this.department = data;
      },
      error: (error) => {
        console.error('Error fetching department details:', error);
        this.department = null;
      }

    });  
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  formatNumber(num: number): string {
    if (!num || num === 0) {
      return '0';
    }
    return num.toLocaleString('he-IL');
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  renameDepartment(department: string): string {
    switch (department) {
        case 'פיתוח': return 'DEV';
        case 'משאבי אנוש': return 'HR';
        case 'מכירות': return 'SALES';
        case 'שיווק': return 'MARKETING';
        case 'תמיכה': return 'IT';
        case 'ניהול': return 'MANAGEMENT';
        case 'כספים': return 'FINANCE';
        default: return department;
    }
  }
}