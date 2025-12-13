import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NotificationService } from "../../services/notificationService.service";
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatRowDef, MatHeaderRowDef } from "@angular/material/table";
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";


interface AttendanceRecord {
    day: string;
    startTime: string;
    endTime: string;
    totalTime:string;
    typeOfattend: string;
    status: string;
}
const DUMMY_ATTENDANCE_DATA: AttendanceRecord[] = [
    { day: 'ראשון', startTime: '08:15', endTime: '16:45', totalTime: '08:30', typeOfattend: 'עבודה', status: 'אושר' },
    { day: 'שני', startTime: '09:00', endTime: '17:30', totalTime: '08:30', typeOfattend: 'עבודה', status: 'אושר', },
    { day: 'שלישי', startTime: '08:00', endTime: '14:00', totalTime: '06:00', typeOfattend: 'עבודה', status: 'ממתין לאישור' },
    { day: 'רביעי', startTime: '00:00', endTime: '00:00', totalTime: '00:00', typeOfattend: 'חופשת מחלה', status: 'אושר'},
    { day: 'חמישי', startTime: '10:00', endTime: '15:30', totalTime: '05:30', typeOfattend: 'חופשה שנתית', status: 'נדחה' },
    { day: 'שישי', startTime: '08:30', endTime: '13:00', totalTime: '04:30', typeOfattend: 'עבודה', status: 'אושר' },

    { day: 'ראשון', startTime: '07:45', endTime: '16:15', totalTime: '08:30', typeOfattend: 'עבודה', status: 'אושר' },
    { day: 'שני', startTime: '09:30', endTime: '18:00', totalTime: '08:30', typeOfattend: 'עבודה', status: 'אושר' },
    { day: 'שלישי', startTime: '08:00', endTime: '12:30', totalTime: '04:30', typeOfattend: 'עבודה', status: 'ממתין לאישור' },
    { day: 'רביעי', startTime: '00:00', endTime: '00:00', totalTime: '00:00', typeOfattend: 'חופשת מחלה', status: 'אושר'},
    { day: 'חמישי', startTime: '08:00', endTime: '13:00', totalTime: '05:00', typeOfattend: 'חופשה שנתית', status: 'נדחה' },
    { day: 'שישי', startTime: '09:00', endTime: '13:30', totalTime: '04:30', typeOfattend: 'עבודה', status: 'אושר' },
];
@Component({
    selector: 'app-employee-attendece',
    standalone: true,
    styleUrls: ['./employee-attendence.css'],
    templateUrl: './employee-attendence.html',
    imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatRowDef,
    MatHeaderRowDef,
    MatTableModule,
    MatIcon
]
})

export class EmployeeAttendence implements OnInit {

    displayedColumns: string[] = ['day', 'startTime', 'endTime','totalTime','typeOfattend' ,'status','actions'];
    dataSource = new MatTableDataSource<any>([]);

    constructor(private router: Router,private employeeService: EmployeeService,private notificationService: NotificationService) {}

    ngOnInit(){
        this.loadAttendence();
    }
    loadAttendence(){
        this.dataSource.data = DUMMY_ATTENDANCE_DATA;
        console.log('Dummy data loaded:', this.dataSource.data);
    }
    onEdit(){

    }
    onDelete(){
    }

}