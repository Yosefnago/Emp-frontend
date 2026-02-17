// attendance.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AttendanceService } from '../../core/services/attendance.service';
import { AttendanceSummary, SearchQuery } from '../../core/models/Attendance';
import { SystemMessages } from '../../core/services/system-messages.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule,MatProgressSpinnerModule],
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

  attendanceMonthSendedToPayroll: boolean = false;
  sending = false;

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

  constructor(private router: Router, private attendanceService: AttendanceService,private systemMessages: SystemMessages) { }

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

      this.allRecords = records.map((record, index) => ({
        ...record,

        uiId: `record-${index}-${Date.now()}`,
        date: new Date(record.date)
      }));

      this.filteredRecords = [...this.allRecords];

      this.filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      this.checkIfPeriodClosed();
    });
  }

  checkIfPeriodClosed(): void {
    if (this.filteredRecords.length === 0) {
      this.attendanceMonthSendedToPayroll = false;
      return;
    }

    this.attendanceMonthSendedToPayroll = this.filteredRecords.every(
      record => record.attendanceClosed === true
    );
  }

  clearFilters(): void {
    this.selectedYear = new Date().getFullYear().toString();
    this.selectedMonth = '';
    this.selectedDepartment = '';
    this.selectedEmployeeName = '';
    this.filteredRecords = [];
    this.attendanceMonthSendedToPayroll = false;
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
  editingRecordId: string | null = null;
  tempRecord: any = null;


  startEdit(record: any): void {
    if (this.attendanceMonthSendedToPayroll) {
      this.systemMessages.show('לא ניתן לערוך תקופה סגורה', false);
      return;
    }

    this.editingRecordId = record.uiId;
    this.tempRecord = { ...record };

    if (this.tempRecord.date instanceof Date) {
      this.tempRecord.date = this.tempRecord.date.toISOString().split('T')[0];
    }
  }

  cancelEdit(): void {
    if (this.attendanceMonthSendedToPayroll) {
      return;
    }
    this.editingRecordId = null;
    this.tempRecord = null;
  }

  saveRecord(): void {
    if (this.attendanceMonthSendedToPayroll) {
      this.systemMessages.show('לא ניתן לשמור שינויים בתקופה סגורה', false);
      return;
    }
    if (!this.tempRecord) return;

    const index = this.allRecords.findIndex(r => r.id === this.tempRecord.id);

    if (index !== -1) {

      this.allRecords[index] = {
        ...this.tempRecord,
        date: new Date(this.tempRecord.date)
      };
    } else {

      this.allRecords.unshift({
        ...this.tempRecord,
        date: new Date(this.tempRecord.date)
      });
    }

    this.attendanceService.updateAttendanceRecord(this.tempRecord).subscribe(() => {
      this.loadAttendanceData();
    });

    this.editingRecordId = null;
    this.tempRecord = null;

  }

  addRecord(): void {
    if (this.attendanceMonthSendedToPayroll) {
      this.systemMessages.show('לא ניתן להוסיף רשומות לתקופה סגורה', false);
      return;
    }
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

    this.allRecords.unshift({
      ...newRecord,
      date: new Date()
    });

    this.filterAttendance();
    this.startEdit(this.allRecords.find(r => r.id === newId));
  }

  deleteRecord(id: number): void {
    if (this.attendanceMonthSendedToPayroll) {
      this.systemMessages.show('לא ניתן למחוק רשומות מתקופה סגורה', false);
      return;
    }
    this.allRecords = this.allRecords.filter(r => r.id !== id);
    this.filterAttendance();
  }

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
  /// Payroll Integration --------------------- 
  // to complete the payroll integration.
  sendToPayroll(): void {
    if (this.sending) {
      return; 
    }

    if (this.attendanceMonthSendedToPayroll) {
      this.systemMessages.show('תקופה זו כבר נסגרה ונשלחה לעיבוד שכר', false);
      return;
    }
    if(!this.attendanceRecordsValidort()){
      return
    }
    
     const attendanceSummary: AttendanceSummary = {
      personalId: this.filteredRecords[0]?.personalId || '',
      year: this.selectedYear,
      month: this.selectedMonth,
      department: this.selectedDepartment,
      employeeName: this.selectedEmployeeName,
    }; 
        
    this.sending = true;
    this.attendanceService.sendToPayroll(attendanceSummary).subscribe({
      

      next: () => {
        this.systemMessages.show('הנתונים נשלחו בהצלחה למחלקת השכר', true);
        this.attendanceMonthSendedToPayroll = true;

        this.loadAttendanceData();
        this.sending = false;
      },
      error: (err) => {
        this.sending = false;
        if (err.error?.errorCode === 'EMP_003') {
          this.systemMessages.show('תקופה זו כבר סגורה', false);
          this.attendanceMonthSendedToPayroll = true;
        } else {
          this.systemMessages.show('אירעה שגיאה בשליחת הנתונים למחלקת השכר', false);
        }
      }
    }); 
  } 
  attendanceRecordsValidort():boolean{

    // validate that year is selected
    if(this.selectedYear ==='' || this.selectedYear === null){
      this.systemMessages.show('אנא בחר שנה', false);
      return false;
    }
    // validate that month is selected
    if(this.selectedMonth ==='' || this.selectedMonth === null){
      this.systemMessages.show('אנא בחר חודש', false);
      return false;
    }
    if(this.selectedDepartment ==='' || this.selectedDepartment === null){
      this.systemMessages.show('אנא בחר מחלקה', false);
      return false;
    }
    if(this.selectedEmployeeName ==='' || this.selectedEmployeeName === null){
      this.systemMessages.show('אנא בחר שם עובד', false);
      return false;
    }
    
    // validate that if there any check-in time is after check-out time
    const invalidCheckIn = this.filteredRecords.find(r => r.checkInTime > r.checkOutTime);

    if (invalidCheckIn) {
      const formattedDate = invalidCheckIn.date.toLocaleDateString();
      this.systemMessages.show(`בתאריך ${formattedDate} יש רשומה עם שעת כניסה מאוחרת משעת יציאה`, false);
      return false;
    }
    
    // validate that if there any record with empty check-in time and status is PRESENT
    const emptyCheckIn = this.filteredRecords.find(r => !r.checkInTime  && r.status === 'PRESENT');

    if (emptyCheckIn) {
      const formattedDate = emptyCheckIn.date.toLocaleDateString();
      this.systemMessages.show(`בתאריך ${formattedDate} יש רשומה עם שעת כניסה ריקה`, false);
      return false;
    }

    // validate that if there any record with empty check-out time and status is PRESENT
    const emptyCheckOut = this.filteredRecords.find(r => !r.checkOutTime && r.status === 'PRESENT');

    if (emptyCheckOut) {
      const formattedDate = emptyCheckOut.date.toLocaleDateString();
      this.systemMessages.show(`בתאריך ${formattedDate} יש רשומה עם שעת יציאה ריקה`, false);
      return false;
    }
    return true;
  }
}