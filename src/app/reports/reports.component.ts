// reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  selectedReportType: string = 'employees';
  startDate: string = '';
  endDate: string = '';
  generatedReports: any[] = [];

  departmentData = [
    { name: 'פיתוח', count: 12 },
    { name: 'משאבי אנוש', count: 8 },
    { name: 'שיווק', count: 10 },
    { name: 'מכירות', count: 15 },
    { name: 'תמיכה', count: 7 }
  ];

  positionData = [
    { name: 'Senior Developer', percentage: 25 },
    { name: 'QA Engineer', percentage: 18 },
    { name: 'Manager', percentage: 22 },
    { name: 'Designer', percentage: 15 },
    { name: 'Support', percentage: 20 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeDates();
    this.loadGeneratedReports();
  }

  initializeDates(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = firstDay.toISOString().split('T')[0];
  }

  onReportTypeChange(): void {
    // Handle report type change
  }

  generateReport(): void {
    const reportTitles: { [key: string]: string } = {
      'employees': 'דוח עובדים חודשי',
      'salary': 'דוח משכורות וקיזוזים',
      'attendance': 'דוח נוכחות וחסרות',
      'performance': 'דוח ביצועים עובדים',
      'departments': 'דוח מחלקות וצוותים'
    };

    const newReport = {
      id: this.generatedReports.length + 1,
      title: reportTitles[this.selectedReportType],
      type: this.selectedReportType,
      createdAt: new Date(),
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.generatedReports.unshift(newReport);
    alert(`דוח "${newReport.title}" נוצר בהצלחה`);
  }

  viewReport(reportId: number): void {
    alert(`צפייה בדוח ${reportId} - פונקציה זו תיושם בעתיד`);
  }

  downloadReport(reportId: number): void {
    alert(`הורדת דוח ${reportId} - פונקציה זו תיושם בעתיד`);
  }

  exportToPDF(): void {
    alert('ייצוא ל-PDF - הדוח יופק בקרוב');
  }

  exportToExcel(): void {
    alert('ייצוא ל-Excel - הדוח יופק בקרוב');
  }

  exportToCSV(): void {
    alert('ייצוא ל-CSV - הדוח יופק בקרוב');
  }

  loadGeneratedReports(): void {
    this.generatedReports = [
      {
        id: 1,
        title: 'דוח עובדים דצמבר 2024',
        type: 'employees',
        createdAt: new Date(2024, 11, 28)
      },
      {
        id: 2,
        title: 'דוח משכורות נובמבר 2024',
        type: 'salary',
        createdAt: new Date(2024, 10, 30)
      },
      {
        id: 3,
        title: 'דוח נוכחות רבעון ד׳',
        type: 'attendance',
        createdAt: new Date(2024, 11, 15)
      },
      {
        id: 4,
        title: 'דוח ביצועים שנתי 2024',
        type: 'performance',
        createdAt: new Date(2024, 11, 20)
      },
      {
        id: 5,
        title: 'דוח מחלקות וצוותים',
        type: 'departments',
        createdAt: new Date(2024, 11, 25)
      }
    ];
  }

  getStatistics(): any {
    return {
      totalEmployees: 52,
      totalPayroll: 820000,
      attendanceRate: 94,
      activeDepartments: 7
    };
  }

  formatNumber(num: number): string {
    if (!num || num === 0) {
      return '0';
    }
    return num.toLocaleString('he-IL');
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}