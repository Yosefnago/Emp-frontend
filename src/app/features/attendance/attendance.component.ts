// attendance.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AttendanceService } from '../../core/services/attendance.service';
import { SearchQuery } from '../../core/models/Attendance';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = '';
  selectedDepartment: string = '';
  selectedEmployeeName: string = ''; 
  

  filteredRecords: any[] = [];
  allRecords: any[] = [];
  availableYears: number[] = [];

  departments: string[] = ['פיתוח', 'משאבי אנוש', 'מכירות', 'שיווק', 'תמיכה', 'ניהול', 'כספים'
  ];


  private readonly departmentMap: Record<string, string> = {
    'פיתוח': 'DEV',
    'משאבי אנוש': 'HR',
    'מכירות': 'SALES',
    'שיווק': 'MARKETING',
    'תמיכה': 'IT',
    'ניהול': 'MANAGEMENT',
    'כספים': 'Finance'
  };

  // Unique employees for the filter dropdown
  uniqueEmployees: { name: string, department: string }[] = [];

  constructor(private router: Router,private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.initializeYears();
    this.initilazieMapOfEemployees();
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }
  initilazieMapOfEemployees(): void {
    
    this.attendanceService.loadMapOfEmployees().subscribe(employees => {
      this.uniqueEmployees = employees;
    });
  }

  
  get availableEmployees() {
    if (!this.selectedDepartment) {
      return this.uniqueEmployees;
    }

    const deptCode = this.departmentMap[this.selectedDepartment]; 
    if (!deptCode) return []; 

    return this.uniqueEmployees.filter(emp => emp.department === deptCode);
  }

  loadAttendanceData(): void {
    this.filterAttendance();
  }

  filterAttendance(): void {

    const departmentCode = this.selectedDepartment 
        ? this.departmentMap[this.selectedDepartment] 
        : '';

    const query: SearchQuery = {
      year: this.selectedYear,
      month: this.selectedMonth,
      department: departmentCode || '',
      employeeName: this.selectedEmployeeName || ''
    };
    
    this.attendanceService.loadAttendanceRecords(query).subscribe(records => {

      this.allRecords = records.map(record => ({
        ...record,
        date: new Date(record.date)
      }));
      
      this.filteredRecords = [...this.allRecords];
      
      this.filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  }

  clearFilters(): void {
    this.selectedYear = new Date().getFullYear().toString();
    this.selectedMonth = '';
    this.selectedDepartment = '';
    this.selectedEmployeeName = '';
    this.filterAttendance();
  }

  getDayOfWeek(date: Date): string {
    const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return dayNames[date.getDay()];
  }

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PRESENT': 'נוכחות',
      'ABSENT': 'חסר',
      'SICK': 'מחלה',
      'VACATION': 'חופשה'
    };
    return statusMap[status] || status;
  }

  calculateWorkHours(checkIn: string | null, checkOut: string | null): string {
    if (!checkIn || !checkOut) return '-';

    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);

    let hours = outHour - inHour;
    let minutes = outMin - inMin;

    if (minutes < 0) {
      hours--;
      minutes += 60;
    }

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  attendanceTypes: string[] = ['נוכחות', 'תפקיד', 'חופשה', 'מחלה'];
  editingRecordId: number | null = null;
  tempRecord: any = null;

  // ... existing code ...

  startEdit(record: any): void {
    this.editingRecordId = record.id;
    this.tempRecord = { ...record };
    // Format date for input type="date"
    if (this.tempRecord.date instanceof Date) {
      this.tempRecord.date = this.tempRecord.date.toISOString().split('T')[0];
    }
  }

  cancelEdit(): void {
    this.editingRecordId = null;
    this.tempRecord = null;
  }

  saveRecord(): void {
    if (!this.tempRecord) return;

    const index = this.allRecords.findIndex(r => r.id === this.tempRecord.id);
    if (index !== -1) {
      // Update existing record
      this.allRecords[index] = {
        ...this.tempRecord,
        date: new Date(this.tempRecord.date)
      };
    } else {
      // Add new record (if it was a temporary new record)
      this.allRecords.unshift({
        ...this.tempRecord,
        date: new Date(this.tempRecord.date)
      });
    }

    this.editingRecordId = null;
    this.tempRecord = null;
    this.filterAttendance();
  }

  addRecord(): void {
    const newId = Math.max(...this.allRecords.map(r => r.id), 0) + 1;
    const newRecord = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      employeeName: '',
      employeePosition: '',
      department: '',
      checkInTime: '',
      checkOutTime: '',
      status: 'PRESENT',
      notes: '',
      travelAllowance: false
    };
    
    // We add it to filteredRecords directly or handle it as a temporary unsaved row. 
    // Simplified: Push to filteredRecords temporarily or just start editing a "ghost" record?
    // Let's add it to allRecords and start editing.
    // Note: To make it appear at the top, we might need to handle sorting.
    
    this.allRecords.unshift({
        ...newRecord,
        date: new Date()
    });
    
    this.filterAttendance(); // Refresh to show it (sorting might move it though if date is old)
    this.startEdit(this.allRecords.find(r => r.id === newId));
  }

  deleteRecord(id: number): void {
      this.allRecords = this.allRecords.filter(r => r.id !== id);
      this.filterAttendance();
  }
  
  // ... existing code ...

  getSummary(): any {
    const presentDays = this.filteredRecords.filter(r => r.status === 'PRESENT').length;
    const absentDays = this.filteredRecords.filter(r => r.status === 'ABSENT').length;
    const sickDays = this.filteredRecords.filter(r => r.status === 'SICK').length;
    const vacationDays = this.filteredRecords.filter(r => r.status === 'VACATION').length;

    const totalWorkingDays = presentDays + absentDays;
    const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;

    let totalMinutes = 0;
    this.filteredRecords.forEach(r => {
        if (r.checkInTime && r.checkOutTime) {
            const [inH, inM] = r.checkInTime.split(':').map(Number);
            const [outH, outM] = r.checkOutTime.split(':').map(Number);
            let mins = (outH * 60 + outM) - (inH * 60 + inM);
            if (mins > 0) totalMinutes += mins;
        }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalHours = `${hours}:${minutes.toString().padStart(2, '0')}`;

    return {
      presentDays,
      absentDays,
      sickDays,
      vacationDays,
      attendanceRate,
      totalHours
    };
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}