// department.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  selectedDepartment: string = '';
  department: any = null;

  departments = [
    'פיתוח',
    'משאבי אנוש',
    'שיווק',
    'מכירות',
    'תמיכה',
    'ניהול',
    'כספים'
  ];

  departmentData: any = {
    'פיתוח': {
      name: 'פיתוח',
      code: 'DEV-001',
      manager: 'יוסף נג',
      phone: '03-1234567',
      email: 'dev@company.com',
      floor: 3,
      budget: 500000,
      foundedDate: '15/01/2020',
      totalEmployees: 12,
      employees: [
        { id: 1, name: 'יוסף נג', position: 'Senior Developer', email: 'yosef@company.com' },
        { id: 2, name: 'מרים כהן', position: 'QA Engineer', email: 'miriam@company.com' },
        { id: 3, name: 'אלחנן ברק', position: 'DevOps', email: 'elhanan@company.com' },
        { id: 4, name: 'שרה זילברמן', position: 'Frontend Developer', email: 'sarah@company.com' },
        { id: 5, name: 'מיכאל ספיר', position: 'Backend Developer', email: 'michael@company.com' },
      ]
    },
    'משאבי אנוש': {
      name: 'משאבי אנוש',
      code: 'HR-001',
      manager: 'רונית לוי',
      phone: '03-2345678',
      email: 'hr@company.com',
      floor: 2,
      budget: 300000,
      foundedDate: '20/03/2019',
      totalEmployees: 8,
      employees: [
        { id: 6, name: 'רונית לוי', position: 'Head of HR', email: 'ronit@company.com' },
        { id: 7, name: 'אביב יוסף', position: 'Recruiter', email: 'aviv@company.com' },
        { id: 8, name: 'דנה אברהם', position: 'HR Coordinator', email: 'dana@company.com' },
      ]
    },
    'שיווק': {
      name: 'שיווק',
      code: 'MKT-001',
      manager: 'דני ברגר',
      phone: '03-3456789',
      email: 'marketing@company.com',
      floor: 4,
      budget: 400000,
      foundedDate: '10/05/2021',
      totalEmployees: 10,
      employees: [
        { id: 9, name: 'דני ברגר', position: 'Marketing Manager', email: 'danny@company.com' },
        { id: 10, name: 'לאה בן דוד', position: 'Content Manager', email: 'lea@company.com' },
        { id: 11, name: 'עומר שלום', position: 'Social Media Specialist', email: 'omer@company.com' },
      ]
    },
    'מכירות': {
      name: 'מכירות',
      code: 'SAL-001',
      manager: 'אברהם כהן',
      phone: '03-4567890',
      email: 'sales@company.com',
      floor: 5,
      budget: 600000,
      foundedDate: '01/01/2018',
      totalEmployees: 15,
      employees: [
        { id: 12, name: 'אברהם כהן', position: 'Sales Manager', email: 'abraham@company.com' },
        { id: 13, name: 'רחל ממן', position: 'Account Manager', email: 'rachel@company.com' },
        { id: 14, name: 'גיל רסקי', position: 'Sales Executive', email: 'gil@company.com' },
      ]
    },
    'תמיכה': {
      name: 'תמיכה',
      code: 'SUP-001',
      manager: 'יליד סימן טוב',
      phone: '03-5678901',
      email: 'support@company.com',
      floor: 1,
      budget: 250000,
      foundedDate: '12/06/2020',
      totalEmployees: 7,
      employees: [
        { id: 15, name: 'יליד סימן טוב', position: 'Support Manager', email: 'yalid@company.com' },
        { id: 16, name: 'ניצן פישר', position: 'Support Agent', email: 'nitzan@company.com' },
      ]
    },
    'ניהול': {
      name: 'ניהול',
      code: 'ADM-001',
      manager: 'שלומי דיין',
      phone: '03-6789012',
      email: 'admin@company.com',
      floor: 6,
      budget: 200000,
      foundedDate: '03/02/2019',
      totalEmployees: 5,
      employees: [
        { id: 17, name: 'שלומי דיין', position: 'Admin Manager', email: 'shlomi@company.com' },
      ]
    },
    'כספים': {
      name: 'כספים',
      code: 'FIN-001',
      manager: 'מיכל גינזבורג',
      phone: '03-7890123',
      email: 'finance@company.com',
      floor: 6,
      budget: 350000,
      foundedDate: '15/07/2018',
      totalEmployees: 9,
      employees: [
        { id: 18, name: 'מיכל גינזבורג', position: 'Finance Manager', email: 'michal@company.com' },
        { id: 19, name: 'אמנון כהן', position: 'Accountant', email: 'amnon@company.com' },
      ]
    }
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onDepartmentChange(): void {
    if (this.selectedDepartment) {
      this.department = this.departmentData[this.selectedDepartment];
    } else {
      this.department = null;
    }
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