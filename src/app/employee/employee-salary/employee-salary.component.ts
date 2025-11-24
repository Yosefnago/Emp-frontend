import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NotificationService } from "../../services/notificationService.service";


@Component({
    selector: 'app-employee-salary',
    standalone: true,
    styleUrls: ['./employee-salary.component.css'],
    templateUrl: './employee-salary.component.html',
    imports:
        [
            CommonModule,
            NgOptimizedImage,
            RouterLink
        ]
})

export class EmployeeSalaryComponent implements OnInit{
    employeeSalary:any;

    employee: any;
    personalId!: string;

    constructor(private route: ActivatedRoute,private employeeService: EmployeeService,private notificationService: NotificationService) {}

    ngOnInit(): void {
        
        this.personalId = this.route.snapshot.params['personalId'];
        this.loadEmployee();
    }
    private loadEmployee(): void {
        this.employeeService.loadEmployeeSalary(this.personalId).subscribe({
            next: (data) => this.employeeSalary = data,
            error: () => this.notificationService.show('שגיאה בטעינת נתוני שכר', false)
        });
    }
}