import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { SystemMessages } from '../../../core/services/system-messages.service';
import { UpdateEmployeeRequest } from '../../../core/models/Employee';
import { SalaryService } from '../../../core/services/salary-service';
import { SalaryDetails, UpdateSalaryDetailsRequest } from '../../../core/models/SalaryDetails';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  activeTab: string = 'personal';
  currentDate: Date = new Date();

  // Employee data
  employee: any = null;
  employeeBackup: any = null;
  salaryDetails: any = null;
  salaryDetailsBackup: any = null;

  searchYear: number = new Date().getFullYear();
  searchMonth: number = 0;
  availableSearchYears: number[] = [2026, 2025, 2024, 2023, 2022];
  salarySlipResults: any[] = [];

  attendanceStats: any = { presentDays: 0, absentDays: 0, sickDays: 0, vacationDays: 0, attendanceRate: 0 };

  isLoading: boolean = true;
  errorMessage: string = '';

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
    this.route.params.subscribe(params => {
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

    this.employeeService.getEmployeeByPersonalId(personalId).subscribe({
      next: (employee: any) => {
        if (!employee) return;
        const empId = employee.id || Number(personalId) || 0;
        const normalized = this.normalizeEmployeeData(employee);
        normalized.id = empId;

        this.employee = normalized;
        this.employeeBackup = JSON.parse(JSON.stringify(normalized));
        this.isLoading = false;

        this.loadSalaryDetails(empId);
        this.loadCurrentMonthStats(personalId);
      },
      error: () => { this.isLoading = false; }
    });
  }
  loadCurrentMonthStats(personalId: string): void {
    this.employeeService.getCurrentMonthAttendanceStats(personalId).subscribe({
      next: (stats) => {

        this.attendanceStats = stats;
      },
      error: () => {
        this.systemService.show('שגיאה בטעינת נתוני יתרות', false);
      }
    });
  }
  loadEmployeeOnly(personalId: string): void {
    this.employeeService.getEmployeeByPersonalId(personalId).subscribe({
      next: (employee: any) => {
        if (!employee) return;
        const empId = employee.id || this.employee?.id || Number(personalId) || 0;
        const normalized = this.normalizeEmployeeData(employee);
        normalized.id = empId;
        this.employee = normalized;
        this.employeeBackup = JSON.parse(JSON.stringify(normalized));
      }
    });
  }

  loadSalaryDetails(employeeId: number): void {
    if (!employeeId) return;
    this.salaryService.getSalaryDetails(employeeId).subscribe({
      next: (data: SalaryDetails) => {
        this.salaryDetails = data;
        this.salaryDetailsBackup = JSON.parse(JSON.stringify(data));
      },
      error: (err: any) => { console.error('Error loading salary details', err); }
    });
  }

  private normalizeEmployeeData(emp: any): any {
    if (!emp) return emp;
    const enums = ['familyStatus', 'jobType', 'status', 'gender'];
    enums.forEach(key => {
      if (emp[key] && typeof emp[key] === 'string') {
        emp[key] = emp[key].toUpperCase().replace('-', '_');
      }
    });
    const dates = ['birthDate', 'hireDate'];
    dates.forEach(key => {
      if (emp[key]) {
        try {
          const d = new Date(emp[key]);
          if (!isNaN(d.getTime())) {
            const offset = d.getTimezoneOffset();
            const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
            emp[key] = adjustedDate.toISOString().split('T')[0];
          }
        } catch (e) { }
      }
    });
    if (emp.department && typeof emp.department === 'object') {
      emp.department = emp.department.name || emp.department.id || emp.department;
    }
    return emp;
  }

  switchTab(tab: string): void { this.activeTab = tab; }
  goBack(): void { this.router.navigate(['/home/employees']); }

  toggleEditPersonal(): void { this.isEditingPersonal = true; }
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
      next: () => {
        this.isEditingPersonal = false;
        this.isLoading = false;
        this.systemService.show('פרטי עובד עודכנו בהצלחה', true);
        this.loadEmployeeOnly(this.employee.personalId);
      },
      error: () => {
        this.isLoading = false;
        this.systemService.show('שגיאה בעדכון פרטי עובד', false);
      }
    });
  }

  toggleEditSalary(): void { this.isEditingSalary = true; }
  cancelSalaryEdit(): void {
    if (this.salaryDetailsBackup) {
      this.salaryDetails = { ...this.salaryDetailsBackup };
    }
    this.isEditingSalary = false;
  }

  saveSalaryChanges(): void {
    if (!this.salaryDetails || !this.employee) return;
    this.isLoading = true;
    const updateRequest: UpdateSalaryDetailsRequest = {
      personalId: this.employee.personalId,
      totalSeekDays: this.salaryDetails.totalSeekDays,
      totalVacationDays: this.salaryDetails.totalVacationDays,
      salaryPerHour: this.salaryDetails.salaryPerHour,
      seniority: this.salaryDetails.seniority,
      creditPoints: this.salaryDetails.creditPoints,
      pensionFund: this.salaryDetails.pensionFund,
      insuranceCompany: this.salaryDetails.insuranceCompany,
      providentFund: this.salaryDetails.providentFund
    };

    this.salaryService.updateSalaryDetails(updateRequest, this.employee.personalId).subscribe({
      next: () => {
        this.isEditingSalary = false;
        this.isLoading = false;
        this.systemService.show('פרטי שכר עודכנו בהצלחה', true);
        const empId = this.employee?.id || Number(this.employee?.personalId) || 0;
        if (empId) this.loadSalaryDetails(empId);
      },
      error: () => {
        this.isLoading = false;
        this.systemService.show('שגיאה בעדכון פרטי שכר', false);
      }
    });
  }

  calculateMonthsInCompany(): string {
    if (!this.employee?.hireDate) return '0';
    const startDate = new Date(this.employee.hireDate);
    const now = new Date();
    let months = (now.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += now.getMonth();
    return months.toString();
  }

  formatNumber(num: number): string { return (!num || num === 0) ? '0' : num.toLocaleString('he-IL'); }
  translateMaritalStatus(status: string): string { const map: any = { 'SINGLE': 'רווק/ה', 'MARRIED': 'נשוי/ה', 'DIVORCED': 'גרוש/ה', 'WIDOWED': 'אלמן/ה' }; return map[status?.toUpperCase()] || status; }
  translateEmploymentType(type: string): string { const map: any = { 'FULL_TIME': 'משרה מלאה', 'PART_TIME': 'משרה חלקית', 'CONTRACTOR': 'קבלן' }; return map[type?.toUpperCase()] || type; }
  translateStatus(status: string): string { const map: any = { 'ACTIVE': 'פעיל', 'INACTIVE': 'לא פעיל' }; return map[status?.toUpperCase()] || status; }

  executeSalarySearch(): void {
    if (!this.employee?.personalId) return;

    this.salaryService.searchSalarySlips(this.employee.personalId, this.searchYear, this.searchMonth)
      .subscribe({
        next: (results) => {
          this.salarySlipResults = results || [];
        },
        error: () => {
          this.salarySlipResults = [];
        }
      });
  }

  viewSlipPdf(salaryId: number): void {
    this.salaryService.getSalaryPdfBlob(salaryId, 'view').subscribe({
      next: (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error: () => {
        this.systemService.show('שגיאה בפתיחת תלוש השכר', false);
      }
    });
  }


  downloadSlipPdf(salaryId: number, month: number, year: number): void {
    this.salaryService.getSalaryPdfBlob(salaryId, 'download').subscribe({
      next: (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `תלוש_${this.employee?.firstName || 'עובד'}_${month}_${year}.pdf`;
        link.click();

        setTimeout(() => URL.revokeObjectURL(fileURL), 100);
      },
      error: () => {
        this.systemService.show('שגיאה בהורדת תלוש השכר', false);
      }
    });
  }
}