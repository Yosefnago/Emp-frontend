import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import { HomeService } from '../services/home.service';


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

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadNumberOfEmployees();
    this.loadTotalSalaries();
  }

  loadNumberOfEmployees() {
    this.homeService.loadNumberOfEmployees().subscribe({
      next: (res: number) => this.numberofemployees = res
    });
  }

  loadTotalSalaries() {
    this.homeService.loadTotalSalaries().subscribe({
      next: (res: number) => this.totalsalaries = res
    });
  }
}
