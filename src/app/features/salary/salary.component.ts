// salary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaryService } from '../../core/services/salary-service';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();   
  selectedMonth: number = new Date().getMonth() + 1;  
  expandedEmployeeId: number | null = null;

  totalSalary:number = 0;
  avgSalary:number = 0;
  maxSalary:number = 0;

  filteredSalaries: any[] = [];
  allSalaries: any[] = [];
  availableYears: number[] = [];

  constructor(private router: Router,private salaryService: SalaryService) {}

  ngOnInit(): void {
    this.initializeYears();
  }

  initializeYears(): void {
    const currentYear = 2026;
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  clearFilters(): void {
    this.selectedYear = 2025;
    this.selectedMonth = 0;
    this.expandedEmployeeId = null;
    this.getSalaryStats();
  }
  applyFilters(): void {
    this.getSalaryStats();
  }

  getSalaryStats(): void {
    this.salaryService
      .getSalariesByYearAndMonth(this.selectedYear, this.selectedMonth)
      .subscribe({
        next: (response) => {
          this.totalSalary = response.totalSalary;
          this.avgSalary = response.avgSalary;
          this.maxSalary = response.maxSalary;
        },
        error: (err) => {
          console.error('Error retrieving salaries:', err);
        }
      });
  }

  formatNumber(num: number | null | undefined): string {
    if (!num || num === 0) {
      return '0';
    }
    return num.toLocaleString('he-IL');
  }

  getMonthName(monthNum: string | number): string {
    const monthMap: { [key: string]: string } = {
      '1': 'ינואר',
      '2': 'פברואר',
      '3': 'מרץ',
      '4': 'אפריל',
      '5': 'מאי',
      '6': 'יוני',
      '7': 'יולי',
      '8': 'אוגוסט',
      '9': 'ספטמבר',
      '10': 'אוקטובר',
      '11': 'נובמבר',
      '12': 'דצמבר',
      '': 'כל החודשים'
    };
    return monthMap[monthNum.toString()] || 'לא ידוע';
  }

  
  goBack(): void {
    this.router.navigate(['/home']);
  }
}