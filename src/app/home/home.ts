import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    FormsModule,
    CommonModule
  ]
})


export class HomeComponent implements OnInit {
  numberofemployees: number = 0;
  totalsalaries: number = 0;

  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
    this.loadNumberOfEmployees();
    this.loadTotalSalaries();
  }

  loadNumberOfEmployees() {
    this.http.get<number>(
      'http://localhost:8090/employees/loadNumberOfEmployees',{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      }).subscribe({
      next: (res: number) => this.numberofemployees = res
    });
  }
  loadTotalSalaries(){
    this.http.get<number>(
      'http://localhost:8090/salary/salaries',{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      }).subscribe({
        next:(res:number) => this.totalsalaries = res
      });
  }
}
