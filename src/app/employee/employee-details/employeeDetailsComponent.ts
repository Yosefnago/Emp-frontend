import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-employee-details',
  templateUrl: 'employeeDetailsComponent.html',
  styleUrls: ['employeeDetailsComponent.css'],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterLink
    //DatePipe
  ],
  standalone: true
})

export class EmployeeDetailsComponent implements OnInit {

  employee: any;
  personalId!: string;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    //this.loadEmployee();
    this.personalId = this.route.snapshot.params['personalId']!;
  }

  private loadEmployee(): void {
    const id = this.route.snapshot.paramMap.get('personalId');
    this.http.get(`http://localhost:8090/employees/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    }).subscribe({
      next: (data) => this.employee = data,
      error: (err) => console.error('❌ שגיאה בטעינת עובד:', err)
    });
  }
}
