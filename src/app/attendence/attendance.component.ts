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
  expandedId: number | null = null;

  filteredRecords: any[] = [];
  allRecords: any[] = [];
  availableYears: number[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeYears();
    this.loadAttendanceData();
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  loadAttendanceData(): void {
  this.allRecords = [
    {
      id: 1,
      date: new Date(2025, 11, 15), // Changed to 2025
      employeeName: 'יוסף נג',
      employeePosition: 'Senior Developer',
      checkInTime: '08:30',
      checkOutTime: '17:15',
      status: 'PRESENT',
      notes: ''
    },
    {
      id: 2,
      date: new Date(2025, 11, 16),
      employeeName: 'מרים כהן',
      employeePosition: 'QA Engineer',
      checkInTime: '09:00',
      checkOutTime: '17:30',
      status: 'PRESENT',
      notes: ''
    },
    {
      id: 3,
      date: new Date(2025, 11, 17),
      employeeName: 'אלחנן ברק',
      employeePosition: 'DevOps',
      checkInTime: null,
      checkOutTime: null,
      status: 'SICK',
      notes: 'כאב גרון'
    },
    {
      id: 4,
      date: new Date(2025, 11, 18),
      employeeName: 'שרה זילברמן',
      employeePosition: 'Frontend Developer',
      checkInTime: '08:15',
      checkOutTime: '16:45',
      status: 'PRESENT',
      notes: ''
    },
    {
      id: 5,
      date: new Date(2025, 11, 19),
      employeeName: 'מיכאל ספיר',
      employeePosition: 'Backend Developer',
      checkInTime: null,
      checkOutTime: null,
      status: 'VACATION',
      notes: 'חופשה שנתית'
    },
    {
      id: 6,
      date: new Date(2025, 11, 22),
      employeeName: 'נעמי רוזנטל',
      employeePosition: 'UI/UX Designer',
      checkInTime: '08:45',
      checkOutTime: '17:00',
      status: 'PRESENT',
      notes: ''
    },
    {
      id: 7,
      date: new Date(2025, 11, 23),
      employeeName: 'יוסף נג',
      employeePosition: 'Senior Developer',
      checkInTime: null,
      checkOutTime: null,
      status: 'ABSENT',
      notes: 'היעדרות לא מוצדקת'
    },
    {
      id: 8,
      date: new Date(2025, 11, 24),
      employeeName: 'מרים כהן',
      employeePosition: 'QA Engineer',
      checkInTime: '08:30',
      checkOutTime: '17:15',
      status: 'PRESENT',
      notes: ''
    },
    {
      id: 9,
      date: new Date(2025, 11, 5),
      employeeName: 'אלחנן ברק',
      employeePosition: 'DevOps',
      checkInTime: '08:00',
      checkOutTime: '17:00',
      status: 'PRESENT',
      notes: ''
    },
    {
      id: 10,
      date: new Date(2025, 11, 6),
      employeeName: 'שרה זילברמן',
      employeePosition: 'Frontend Developer',
      checkInTime: '09:15',
      checkOutTime: '17:30',
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

      let yearMatch = recordYear === this.selectedYear;
      let monthMatch = !this.selectedMonth || recordMonth === this.selectedMonth;

      return yearMatch && monthMatch;
    });

    this.filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  clearFilters(): void {
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = '';
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
      'PRESENT': 'נוכח',
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

  getSummary(): any {
    const presentDays = this.filteredRecords.filter(r => r.status === 'PRESENT').length;
    const absentDays = this.filteredRecords.filter(r => r.status === 'ABSENT').length;
    const sickDays = this.filteredRecords.filter(r => r.status === 'SICK').length;
    const vacationDays = this.filteredRecords.filter(r => r.status === 'VACATION').length;

    const totalWorkingDays = presentDays + absentDays;
    const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;

    return {
      presentDays,
      absentDays,
      sickDays,
      vacationDays,
      attendanceRate
    };
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}