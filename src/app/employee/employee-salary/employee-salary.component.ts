import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";


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

export class EmployeeSalaryComponent{
    employeeSalary:any;

    personalId!: string;
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.personalId = this.route.snapshot.params['personalId']!;
    }
}