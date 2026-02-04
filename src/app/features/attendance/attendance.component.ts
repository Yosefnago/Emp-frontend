// attendance.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  selectedMonth: string = '';
  selectedDepartment: string = '';
  selectedEmployeeName: string = ''; 
  expandedId: number | null = null;

  filteredRecords: any[] = [];
  allRecords: any[] = [];
  availableYears: number[] = [];

  departments: string[] = ['פיתוח', 'משאבי אנוש', 'מכירות', 'בדיקות', 'עיצוב', 'ניהול המוצר'];

  // Unique employees for the filter dropdown
  uniqueEmployees: { name: string, department: string }[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeYears();
    this.loadAttendanceData();
    this.extractUniqueEmployees();
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  extractUniqueEmployees(): void {
    const map = new Map();
    for (const record of this.allRecords) {
      if (!map.has(record.employeeName)) {
        map.set(record.employeeName, {
          name: record.employeeName,
          department: record.department
        });
      }
    }
    this.uniqueEmployees = Array.from(map.values());
  }

  get availableEmployees() {
    if (!this.selectedDepartment) {
      return this.uniqueEmployees;
    }
    return this.uniqueEmployees.filter(emp => emp.department === this.selectedDepartment);
  }

  loadAttendanceData(): void {
    this.allRecords = [
      {
        id: 1,
        date: new Date(2026, 11, 15),
        employeeName: 'יוסף נאגו',
        employeePosition: 'Senior Developer',
        department: 'פיתוח',
        checkInTime: '08:30',
        checkOutTime: '17:15',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 2,
        date: new Date(2026, 11, 16),
        employeeName: 'מרים כהן',
        employeePosition: 'QA Engineer',
        department: 'בדיקות',
        checkInTime: '09:00',
        checkOutTime: '17:30',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 3,
        date: new Date(2026, 11, 17),
        employeeName: 'אלחנן ברק',
        employeePosition: 'DevOps',
        department: 'פיתוח',
        checkInTime: null,
        checkOutTime: null,
        status: 'SICK',
        notes: 'כאב גרון'
      },
      {
        id: 4,
        date: new Date(2026, 11, 18),
        employeeName: 'שרה זילברמן',
        employeePosition: 'Frontend Developer',
        department: 'פיתוח',
        checkInTime: '08:15',
        checkOutTime: '16:45',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 5,
        date: new Date(2026, 11, 19),
        employeeName: 'מיכאל ספיר',
        employeePosition: 'Backend Developer',
        department: 'פיתוח',
        checkInTime: null,
        checkOutTime: null,
        status: 'VACATION',
        notes: 'חופשה שנתית'
      },
      {
        id: 6,
        date: new Date(2026, 11, 22),
        employeeName: 'נעמי רוזנטל',
        employeePosition: 'UI/UX Designer',
        department: 'עיצוב',
        checkInTime: '08:45',
        checkOutTime: '17:00',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 7,
        date: new Date(2026, 11, 23),
        employeeName: 'יוסף נג',
        employeePosition: 'Senior Developer',
        department: 'פיתוח',
        checkInTime: null,
        checkOutTime: null,
        status: 'ABSENT',
        notes: 'היעדרות לא מוצדקת'
      },
      {
        id: 8,
        date: new Date(2026, 11, 24),
        employeeName: 'מרים כהן',
        employeePosition: 'QA Engineer',
        department: 'בדיקות',
        checkInTime: '08:30',
        checkOutTime: '17:15',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 9,
        date: new Date(2026, 11, 5),
        employeeName: 'אלחנן ברק',
        employeePosition: 'DevOps',
        department: 'פיתוח',
        checkInTime: '08:00',
        checkOutTime: '17:00',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 10,
        date: new Date(2026, 11, 6),
        employeeName: 'שרה זילברמן',
        employeePosition: 'Frontend Developer',
        department: 'פיתוח',
        checkInTime: '09:15',
        checkOutTime: '17:30',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 11,
        date: new Date(2026, 11, 6),
        employeeName: 'דוד לוי',
        employeePosition: 'HR Manager',
        department: 'משאבי אנוש',
        checkInTime: '08:00',
        checkOutTime: '16:00',
        status: 'PRESENT',
        notes: ''
      },
      {
        id: 12,
        date: new Date(2026, 11, 6),
        employeeName: 'רחל כהן',
        employeePosition: 'Sales Manager',
        department: 'מכירות',
        checkInTime: '10:00',
        checkOutTime: '19:00',
        status: 'PRESENT',
        notes: ''
      }
    ];

    this.filterAttendance();
  }

  filterAttendance(): void {
    this.filteredRecords = this.allRecords.filter(record => {
      const recordYear = record.date.getFullYear();
      const recordMonth = (record.date.getMonth() + 1).toString();

      let yearMatch = !this.selectedYear || recordYear === +this.selectedYear;
      let monthMatch = !this.selectedMonth || recordMonth === this.selectedMonth;
      let departmentMatch = !this.selectedDepartment || record.department === this.selectedDepartment;
      let employeeMatch = !this.selectedEmployeeName || record.employeeName === this.selectedEmployeeName;

      return yearMatch && monthMatch && departmentMatch && employeeMatch;
    });

    this.filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  clearFilters(): void {
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = '';
    this.selectedDepartment = '';
    this.selectedEmployeeName = '';
    this.filterAttendance();
    this.expandedId = null;
  }

  toggleRecord(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
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