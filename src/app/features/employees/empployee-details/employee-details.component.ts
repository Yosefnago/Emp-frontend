import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { SystemMessages } from '../../../core/services/system-messages.service';
import { UpdateEmployeeRequest } from '../../../core/models/Employee';
import { SalaryService } from '../../../core/services/salary-service';
import { Salary } from '../../../core/models/Salary';
import { SalaryDetails, UpdateSalaryDetailsRequest } from '../../../core/models/SalaryDetails';

interface UnifiedDocument {
  id: number;
  name: string;
  type: 'Payslip' | 'Sick Leave' | '101 Form' | 'Other';
  date: Date;
  url: string;
  amount?: number;
  originalObject?: any;
}

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  // Active tab state
  activeTab: string = 'personal';

  currentDate: Date = new Date();

  // Employee data
  employee: any = null;
  employeeBackup: any = null;
  documents: UnifiedDocument[] = [];
  salaryHistory: Salary[] = [];
  salaryDetails: any = null;
  salaryDetailsBackup: any = null;

  // Document filter
  docFilterYear: string = '';
  docFilterMonth: string = '';
  docFilterType: string = '';
  filteredDocuments: UnifiedDocument[] = [];
  availableDocYears: number[] = [];


  // Statistics
  attendanceStats: any = {
    presentDays: 0,
    absentDays: 0,
    sickDays: 0,
    vacationDays: 0,
    attendanceRate: 0
  };

  // Filter options for attendance
  selectedYear: string = '';
  selectedMonth: string = '';
  availableYears: number[] = [];

  // Loading state
  isLoading: boolean = true;
  errorMessage: string = '';

  // Edit mode flags — independent per tab
  isEditingPersonal: boolean = false;
  isEditingSalary: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private systemService: SystemMessages,
    private salaryService: SalaryService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const personalId = params['id'];

      if (personalId) {
        this.loadEmployeeData(personalId);
      } else {
        this.errorMessage = 'לא צוין מזהה עובד';
        this.isLoading = false;
      }
    });
  }

  loadEmployeeData(personalId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load basic employee info
    this.employeeService.getEmployeeByPersonalId(personalId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.employeeBackup = JSON.parse(JSON.stringify(employee));
        this.initializeAvailableYears();
        this.isLoading = false;

        // Load salary data after we have the employee
        const emp = employee as any;
        const empId = emp?.id || Number(personalId) || 0; // Fallback to personalId if id missing

        //this.loadSalaryHistory(empId);
        this.loadSalaryDetails(empId);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadSalaryHistory(employeeId: number): void {
    this.salaryService.getSalaryHistory(employeeId).subscribe({
      next: (data) => {
        // Handle Salary Data
        if (data && data.length > 0) {
          this.salaryHistory = data;
        } else {
          // Mock salary history if empty
          this.salaryHistory = [
            {
              id: 1,
              salaryMonth: 1,
              salaryYear: 2026,
              salaryAmount: 12500,
              paymentDate: new Date().toISOString(),
              pathOfTlush: 'assets/sample-tlush.pdf',
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              salaryMonth: 12,
              salaryYear: 2025,
              salaryAmount: 12500,
              paymentDate: new Date('2025-12-10').toISOString(),
              pathOfTlush: '',
              createdAt: new Date().toISOString()
            }
          ];
        }

        this.processDocuments();
      },
      error: (err) => {
        console.error('Error loading salary history:', err);

        this.salaryHistory = [
          {
            id: 1,
            salaryMonth: 1,
            salaryYear: 2026,
            salaryAmount: 12500,
            paymentDate: new Date().toISOString(),
            pathOfTlush: 'assets/sample-tlush.pdf',
            createdAt: new Date().toISOString()
          }
        ];
        this.processDocuments();
      }
    });
  }

  loadSalaryDetails(employeeId: number): void {
    this.salaryService.getSalaryDetails(employeeId).subscribe({
      next: (data) => {
        if (data) {
          this.salaryDetails = data;
          this.salaryDetailsBackup = { ...data };
        }
      },
      error: (err) => {
        console.error('Error loading salary details:', err);
      }
    });
  }

  processDocuments(): void {
    const salaryDocs: UnifiedDocument[] = this.salaryHistory
      .filter(s => s.pathOfTlush)
      .map(s => ({
        id: s.id,
        name: `תלוש שכר ${s.salaryMonth}/${s.salaryYear}`,
        type: 'Payslip' as const,
        date: new Date(s.paymentDate),
        url: s.pathOfTlush,
        amount: s.salaryAmount,
        originalObject: s
      }));

    // Add Mock generic documents
    const otherDocs: UnifiedDocument[] = [
      {
        id: 101,
        name: 'טופס 101 - 2026',
        type: '101 Form',
        date: new Date('2026-01-01'),
        url: '#'
      },
      {
        id: 102,
        name: 'אישור מחלה - ינואר',
        type: 'Sick Leave',
        date: new Date('2026-01-15'),
        url: '#'
      }
    ];

    this.documents = [...salaryDocs, ...otherDocs];
    this.filteredDocuments = this.documents;

    // Build available years for filter
    const uniqueYears = new Set(this.documents.map(d => d.date.getFullYear()));
    this.availableDocYears = Array.from(uniqueYears).sort((a, b) => b - a);

    // Initial filter application
    this.applyDocumentFilter();
  }

  applyDocumentFilter(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      const date = new Date(doc.date);
      const yearMatch = !this.docFilterYear || date.getFullYear() === +this.docFilterYear;
      const monthMatch = !this.docFilterMonth || (date.getMonth() + 1) === +this.docFilterMonth;

      let typeMatch = true;
      if (this.docFilterType) {
        if (this.docFilterType === 'Payslip') typeMatch = doc.type === 'Payslip';
        else if (this.docFilterType === '101 Form') typeMatch = doc.type === '101 Form';
        else if (this.docFilterType === 'Sick Leave') typeMatch = doc.type === 'Sick Leave';
        else typeMatch = doc.type === 'Other';
      }

      return yearMatch && monthMatch && typeMatch;
    });
  }

  clearDocumentFilter(): void {
    this.docFilterYear = '';
    this.docFilterMonth = '';
    this.docFilterType = '';
    this.filteredDocuments = this.documents;
  }

  getMonthName(month: number): string {
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    return months[month - 1] || month.toString();
  }

  initializeAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let i = 0; i < 4; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  toggleEditPersonal(): void {
    this.isEditingPersonal = true;
  }

  cancelPersonalEdit(): void {
    this.employee = JSON.parse(JSON.stringify(this.employeeBackup));
    this.isEditingPersonal = false;
  }

  savePersonalChanges(): void {
    if (!this.employee) return;

    this.isLoading = true;
    const updateRequest: UpdateEmployeeRequest = {
      firstName: this.employee.firstName,
      lastName: this.employee.lastName,
      email: this.employee.email,
      personalId: this.employee.personalId,
      gender: this.employee.gender,
      birthDate: this.employee.birthDate,
      familyStatus: this.employee.familyStatus,
      phoneNumber: this.employee.phoneNumber,
      address: this.employee.address,
      city: this.employee.city,
      country: this.employee.country,
      position: this.employee.position,
      department: this.employee.department?.name || this.employee.department,
      hireDate: this.employee.hireDate,
      jobType: this.employee.jobType,
      status: this.employee.status
    };

    this.employeeService.updateEmployee(updateRequest, this.employee.personalId).subscribe({
      next: (updatedEmployee) => {
        this.employee = updatedEmployee;
        this.employeeBackup = JSON.parse(JSON.stringify(updatedEmployee));
        this.isEditingPersonal = false;
        this.isLoading = false;
        this.systemService.show('פרטי עובד עודכנו בהצלחה', true);
        this.loadEmployeeData(this.employee.personalId);
      },
      error: (err) => {
        console.error('Error updating employee:', err);
        this.isLoading = false;
        this.systemService.show('שגיאה בעדכון פרטי עובד', false);
      }
    });
  }

  // Salary Tab Edit 
  toggleEditSalary(): void {
    this.isEditingSalary = true;
  }

  cancelSalaryEdit(): void {
    if (this.salaryDetailsBackup) {
      this.salaryDetails = { ...this.salaryDetailsBackup };
    }
    this.isEditingSalary = false;
  }

  saveSalaryChanges(): void {
    if (!this.salaryDetails) return;
    this.salaryDetailsBackup = { ...this.salaryDetails };

    const updateRequest: UpdateSalaryDetailsRequest = {
      personalId: this.employee?.personalId || '',
      totalSeekDays: this.salaryDetails.totalSeekDays,
      totalVacationDays: this.salaryDetails.totalVacationDays,
      salaryPerHour: this.salaryDetails.salaryPerHour,
      seniority: this.salaryDetails.seniority,
      creditPoints: this.salaryDetails.creditPoints,
      pensionFund: this.salaryDetails.pensionFund,
      insuranceCompany: this.salaryDetails.insuranceCompany,
      providentFund: this.salaryDetails.providentFund

    }
    this.salaryService.updateSalaryDetails(updateRequest, this.employee.personalId).subscribe({
      next: (updatedSalaryDetails) => {
        this.salaryDetails = updatedSalaryDetails;
        this.salaryDetailsBackup = JSON.parse(JSON.stringify(updatedSalaryDetails));
        this.isEditingSalary = false;
        this.isLoading = false;
        this.systemService.show('פרטי שכר עודכנו בהצלחה', true);
      },
      error: () => {
        this.isLoading = false;
        this.systemService.show('שגיאה בעדכון פרטי שכר', false);
      }
    });
    this.isEditingSalary = false;
    this.systemService.show('פרטי שכר עודכנו בהצלחה', true);
  }

  calculateMonthsInCompany(): string {
    if (!this.employee?.hireDate) {
      return '0';
    }

    const startDate = new Date(this.employee.hireDate);
    const now = new Date();

    let months = 0;
    months = (now.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += now.getMonth();

    return months.toString();
  }

  calculateTotalSalary(): number {
    const baseSalary = this.employee?.baseSalary || 0;
    const bonus = this.employee?.bonus || 0;
    const allowance = this.employee?.allowance || 0;

    return baseSalary + bonus + allowance;
  }

  formatNumber(num: number): string {
    if (!num || num === 0) {
      return '0';
    }
    return num.toLocaleString('he-IL');
  }

  translateMaritalStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SINGLE': 'רווק/ה',
      'MARRIED': 'נשוי/ה',
      'DIVORCED': 'גרוש/ה',
      'WIDOWED': 'אלמן/ה'
    };
    return statusMap[status?.toUpperCase()] || status;
  }

  translateEmploymentType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'FULL_TIME': 'משרה מלאה',
      'FULL-TIME': 'משרה מלאה',
      'PART_TIME': 'משרה חלקית',
      'PART-TIME': 'משרה חלקית',
      'TEMPORARY': 'זמני',
      'CONTRACTOR': 'קבלן'
    };
    return typeMap[type?.toUpperCase()] || type;
  }

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'פעיל',
      'INACTIVE': 'לא פעיל'
    };
    return statusMap[status?.toUpperCase()] || status;
  }

  translateAttendanceStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PRESENT': 'נוכח',
      'ABSENT': 'נעדר',
      'LATE': 'איחור',
      'VACATION': 'חופשה',
      'SICK': 'מחלה'
    };
    return statusMap[status?.toUpperCase()] || status;
  }

  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return dayNames[date.getDay()];
  }
}