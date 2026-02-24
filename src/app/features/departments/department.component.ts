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
    this.department = this.selectedDepartment;
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
}