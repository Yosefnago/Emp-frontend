import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { SystemMessages } from '../../../core/services/system-messages.service';
import { UpdateEmployeeRequest } from '../../../core/models/Employee';

/**
 * Employee Details Component
 * 
 * Displays comprehensive employee information including:
 * - Personal details (name, contact, demographics)
 * - Employment information
 * - Attendance statistics and records
 * - Salary information and history
 * - Personal documents
 * 
 * Loads employee data from URL parameter (personalId) and fetches details from backend
 */
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

  // Employee data
  employee: any = null;
  employeeBackup: any = null; // For reverting changes
  documents: any[] = [];
  salaryHistory: any[] = [];
  attendanceRecords: any[] = [];

  // Filtered attendance records (for filtering by month/year)
  filteredAttendanceRecords: any[] = [];

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

  // Edit mode flags
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private systemService: SystemMessages
  ) { }

  /**
   * Angular lifecycle hook - initializes component on mount
   * 1. Extracts personalId from URL parameters
   * 2. Loads employee data from backend
   * 3. Loads related data (documents, attendance, salary)
   */
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

  /**
   * Load all employee-related data from the backend
   * Makes parallel requests to fetch:
   * - Employee basic information
   * - Documents
   * - Salary history
   * - Attendance records
   * 
   * @param personalId - The employee's personal ID from the URL
   */
  loadEmployeeData(personalId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load basic employee info
    this.employeeService.getEmployeeByPersonalId(personalId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.employeeBackup = JSON.parse(JSON.stringify(employee));
        this.initializeAvailableYears();
        this.loadAttendanceStats();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    // Load documents


    // Load salary history


    // Load attendance records

  }

  /**
   * Initialize available years for attendance filtering
   * Generates list of years from 3 years ago to current year
   */
  initializeAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];

    // Add current year and previous 3 years
    for (let i = 0; i < 4; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  /**
   * Load attendance statistics
   * Calculates totals for present days, absent days, sick days, vacation days
   * and overall attendance rate
   */
  loadAttendanceStats(): void {
    if (!this.attendanceRecords || this.attendanceRecords.length === 0) {
      return;
    }

    let presentDays = 0;
    let absentDays = 0;
    let sickDays = 0;
    let vacationDays = 0;
    let totalWorkingDays = 0;

    // Count each type of attendance status
    this.attendanceRecords.forEach(record => {
      const status = record.status?.toLowerCase();

      switch (status) {
        case 'present':
          presentDays++;
          totalWorkingDays++;
          break;
        case 'absent':
          absentDays++;
          totalWorkingDays++;
          break;
        case 'sick':
          sickDays++;
          break; // Sick days don't count against attendance rate
        case 'vacation':
          vacationDays++;
          break; // Vacation days don't count against attendance rate
        default:
          totalWorkingDays++;
      }
    });

    // Calculate attendance rate
    const attendanceRate = totalWorkingDays > 0
      ? Math.round((presentDays / totalWorkingDays) * 100)
      : 0;

    this.attendanceStats = {
      presentDays,
      absentDays,
      sickDays,
      vacationDays,
      attendanceRate
    };
  }

  /**
   * Filter attendance records by selected year and month
   * Called when user changes year or month filter
   */
  filterAttendance(): void {
    this.filteredAttendanceRecords = this.attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear().toString();
      const recordMonth = (recordDate.getMonth() + 1).toString();

      // If no filters selected, show all
      if (!this.selectedYear && !this.selectedMonth) {
        return true;
      }

      // Filter by year only
      if (this.selectedYear && !this.selectedMonth) {
        return recordYear === this.selectedYear;
      }

      // Filter by month only
      if (this.selectedMonth && !this.selectedYear) {
        return recordMonth === this.selectedMonth;
      }

      // Filter by both year and month
      return recordYear === this.selectedYear && recordMonth === this.selectedMonth;
    });
  }

  /**
   * Clear all attendance filters and show all records
   */
  clearFilters(): void {
    this.selectedYear = '';
    this.selectedMonth = '';
    this.filteredAttendanceRecords = this.attendanceRecords;
  }

  /**
   * Switch between different tabs
   * 
   * @param tabName - The name of the tab to switch to
   *   - 'personal': Personal details
   *   - 'documents': Personal documents
   *   - 'salary': Salary information
   *   - 'attendance': Attendance records
   */
  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  /**
   * Navigate back to the employees list page
   */
  goBack(): void {
    this.router.navigate(['/home/employees']);
  }

  /**
   * Toggle edit mode for employee details
   * Enables/disables editing of personal information
   */
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    // If exiting edit mode without saving, revert changes
    if (!this.isEditMode) {
      this.employee = JSON.parse(JSON.stringify(this.employeeBackup));
    }
  }

  /**
   * Save changes to employee data
   * Makes API request to update employee information
   * Handles both personal details and salary information
   */
  saveChanges(): void {
    if (!this.employee) {
      return;
    }

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
      department: this.employee.department,
      hireDate: this.employee.hireDate,
      jobType: this.employee.jobType,
      status: this.employee.status
    };

    this.employeeService.updateEmployee(updateRequest, this.employee.personalId).subscribe({
      next: () => {
        this.employeeBackup = JSON.parse(JSON.stringify(this.employee));
        this.systemService.show('הנתונים נשמרו בהצלחה', true);
      },
      error: () => {
        this.systemService.show('שגיאה בשמירת הנתונים', false);
      },
      complete: () => {
        this.isLoading = false;
        this.isEditMode = false;
      }
    });
  }

  /**
   * Cancel editing and revert to backup
   */
  cancelEdit(): void {
    this.employee = JSON.parse(JSON.stringify(this.employeeBackup));
    this.isEditMode = false;
  }

  /**
   * Calculate the number of months the employee has been in the company
   * Based on employee's start date
   * 
   * @returns - Number of months (as string)
   */
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

  /**
   * Calculate total monthly salary
   * Sum of base salary, bonus, and allowance
   * 
   * @returns - Total salary as number
   */
  calculateTotalSalary(): number {
    const baseSalary = this.employee?.baseSalary || 0;
    const bonus = this.employee?.bonus || 0;
    const allowance = this.employee?.allowance || 0;

    return baseSalary + bonus + allowance;
  }

  /**
   * Format a number with Hebrew locale formatting
   * Converts 1000000 to "1,000,000"
   * 
   * @param num - The number to format
   * @returns - Formatted string with thousands separators
   */
  formatNumber(num: number): string {
    if (!num || num === 0) {
      return '0';
    }
    return num.toLocaleString('he-IL');
  }

  /**
   * Translate English marital status to Hebrew
   * 
   * @param status - English marital status
   * @returns - Hebrew marital status translation
   */
  translateMaritalStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SINGLE': 'רווק/ה',
      'MARRIED': 'נשוי/ה',
      'DIVORCED': 'גרוש/ה',
      'WIDOWED': 'אלמן/ה'
    };
    return statusMap[status?.toUpperCase()] || status;
  }

  /**
   * Translate English employment type to Hebrew
   * 
   * @param type - English employment type
   * @returns - Hebrew employment type translation
   */
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

  /**
  * Translate English employment status to Hebrew
  * 
  * @param status - English status string
  * @returns - Hebrew status translation
  */
  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'פעיל',
      'INACTIVE': 'לא פעיל'
    };
    return statusMap[status?.toUpperCase()] || status;
  }
  /**
   * Translate English attendance status to Hebrew
   * 
   * @param status - English attendance status
   * @returns - Hebrew attendance status translation
   */
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

  /**
   * Get the day of week name in Hebrew
   * 
   * @param dateString - Date string in format YYYY-MM-DD
   * @returns - Hebrew day of week name
   */
  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return dayNames[date.getDay()];
  }
}