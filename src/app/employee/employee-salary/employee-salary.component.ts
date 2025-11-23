import { CommonModule, NgOptimizedImage } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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

export class EmployeeSalaryComponent implements OnInit{
    employeeSalary:any;

    employee: any;
    personalId!: string;

    constructor(private route: ActivatedRoute,private http: HttpClient) {}

    ngOnInit(): void {
        
        this.personalId = this.route.snapshot.params['personalId'];
        this.loadEmployee();
    }
    private loadEmployee(): void {
        
        const id = this.route.snapshot.params['personalId'];
        

        this.http.get(`http://localhost:8090/salary/emp/${id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        }).subscribe({
        next: (data) => this.employeeSalary = data,
        });
  }
}