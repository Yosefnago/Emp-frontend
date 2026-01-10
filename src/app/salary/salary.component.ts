// salary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  selectedYear: number = 2025;
  selectedMonth: string = '';
  expandedEmployeeId: number | null = null;

  filteredSalaries: any[] = [];
  allSalaries: any[] = [];
  availableYears: number[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeYears();
    this.loadSalaryData();
  }

  initializeYears(): void {
    const currentYear = 2025;
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  loadSalaryData(): void {
    this.allSalaries = [
      {
        id: 1,
        employeeName: 'יוסף נג',
        position: 'Senior Developer',
        baseSalary: 18000,
        bonus: 2000,
        allowance: 1500,
        deductions: 1200,
        totalSalary: 20300,
        attendanceComplete: true,
        month: 12,
        year: 2025
      },
      {
        id: 2,
        employeeName: 'מרים כהן',
        position: 'QA Engineer',
        baseSalary: 15000,
        bonus: 1500,
        allowance: 1000,
        deductions: 900,
        totalSalary: 16600,
        attendanceComplete: true,
        month: 12,
        year: 2025
      },
      {
        id: 3,
        employeeName: 'אלחנן ברק',
        position: 'DevOps',
        baseSalary: 19000,
        bonus: 2500,
        allowance: 1500,
        deductions: 1400,
        totalSalary: 21600,
        attendanceComplete: false,
        month: 12,
        year: 2025
      },
      {
        id: 4,
        employeeName: 'שרה זילברמן',
        position: 'Frontend Developer',
        baseSalary: 16000,
        bonus: 1800,
        allowance: 1200,
        deductions: 1000,
        totalSalary: 18000,
        attendanceComplete: true,
        month: 12,
        year: 2025
      },
      {
        id: 5,
        employeeName: 'מיכאל ספיר',
        position: 'Backend Developer',
        baseSalary: 17500,
        bonus: 2000,
        allowance: 1300,
        deductions: 1150,
        totalSalary: 19650,
        attendanceComplete: true,
        month: 12,
        year: 2025
      },
      {
        id: 6,
        employeeName: 'נעמי רוזנטל',
        position: 'UI/UX Designer',
        baseSalary: 14500,
        bonus: 1200,
        allowance: 1000,
        deductions: 850,
        totalSalary: 15850,
        attendanceComplete: true,
        month: 12,
        year: 2025
      },
      {
        id: 7,
        employeeName: 'רונית לוי',
        position: 'Head of HR',
        baseSalary: 16500,
        bonus: 1500,
        allowance: 1200,
        deductions: 1050,
        totalSalary: 18150,
        attendanceComplete: true,
        month: 12,
        year: 2025
      },
      {
        id: 8,
        employeeName: 'דני ברגר',
        position: 'Marketing Manager',
        baseSalary: 15500,
        bonus: 1300,
        allowance: 1000,
        deductions: 900,
        totalSalary: 16900,
        attendanceComplete: true,
        month: 12,
        year: 2025
      }
    ];

    this.filterSalaries();
  }

  filterSalaries(): void {
    this.filteredSalaries = this.allSalaries.filter(salary => {
      let yearMatch = salary.year === this.selectedYear;
      let monthMatch = !this.selectedMonth || salary.month === parseInt(this.selectedMonth);

      return yearMatch && monthMatch;
    });

    this.filteredSalaries.sort((a, b) => b.totalSalary - a.totalSalary);
  }

  clearFilters(): void {
    this.selectedYear = 2025;
    this.selectedMonth = '';
    this.filterSalaries();
    this.expandedEmployeeId = null;
  }

  toggleReport(id: number): void {
    this.expandedEmployeeId = this.expandedEmployeeId === id ? null : id;
  }

  getSalaryStats(): any {
    if (this.filteredSalaries.length === 0) {
      return {
        totalSalaries: 0,
        averageSalary: 0,
        employeeCount: 0,
        maxSalary: 0
      };
    }

    const totalSalaries = this.filteredSalaries.reduce((sum, s) => sum + s.totalSalary, 0);
    const averageSalary = Math.round(totalSalaries / this.filteredSalaries.length);
    const maxSalary = Math.max(...this.filteredSalaries.map(s => s.totalSalary));

    return {
      totalSalaries,
      averageSalary,
      employeeCount: this.filteredSalaries.length,
      maxSalary
    };
  }

  formatNumber(num: number): string {
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

  printReport(salary: any): void {
    const reportWindow = window.open('', '', 'width=800,height=600');
    if (reportWindow) {
      const reportHTML = `
        <html>
          <head>
            <title>דוח משכורה</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .details { margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ccc; }
              .label { font-weight: bold; }
              .total-row { font-size: 18px; font-weight: bold; color: #10b981; margin-top: 20px; padding: 15px 0; background: #f0f0f0; }
              .footer { text-align: center; margin-top: 40px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">דוח משכורה</div>
              <div>${salary.employeeName} - ${salary.position}</div>
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="label">משכורת בסיסית:</span>
                <span>₪${this.formatNumber(salary.baseSalary)}</span>
              </div>
              <div class="detail-row">
                <span class="label">בונוס:</span>
                <span>₪${this.formatNumber(salary.bonus)}</span>
              </div>
              <div class="detail-row">
                <span class="label">קצבה:</span>
                <span>₪${this.formatNumber(salary.allowance)}</span>
              </div>
              <div class="detail-row">
                <span class="label">ניכויים:</span>
                <span>₪${this.formatNumber(salary.deductions)}</span>
              </div>
              <div class="total-row detail-row">
                <span class="label">סך הכל לתשלום:</span>
                <span>₪${this.formatNumber(salary.totalSalary)}</span>
              </div>
            </div>
            <div class="footer">
              <p>דוח זה נוצר ב-${new Date().toLocaleDateString('he-IL')}</p>
            </div>
          </body>
        </html>
      `;
      reportWindow.document.write(reportHTML);
      reportWindow.document.close();
      reportWindow.print();
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}