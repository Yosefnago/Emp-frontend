import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notificationService.service';


@Component({
  selector: 'app-employee-details',
  templateUrl: 'employeeDetailsComponent.html',
  styleUrls: ['employeeDetailsComponent.css'],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterLink
  ],
  standalone: true
})

export class EmployeeDetailsComponent implements OnInit {

  employee: any;
  personalId!: string;

  constructor(
    private route: ActivatedRoute,
    private employeeService:EmployeeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.personalId = this.route.snapshot.params['personalId'];
    this.loadEmployee();
  }

  private loadEmployee(): void {
    
    this.employeeService.loadEmployee(this.personalId).subscribe({
      next: (data) => this.employee = data,
      error: () => this.notificationService.show('שגיאה בטעינת עובדים',false)
    });
  }
}
