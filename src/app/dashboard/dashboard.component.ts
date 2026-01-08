import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  numberOfEmployees = 0;
  numberOfAttendants = 0;
  monthlySalaryTotal = 0;
  projectsOnboard = 0;

  constructor(private router: Router,private homeService:HomeService) {}

  ngOnInit(): void {
    this.loadStats();
  }
  navigateTo(route: string) {
    this.router.navigate(['/home', route]);
  }
  formatNumber(num: number): string {
    return num.toLocaleString('he-IL');
  }
  loadStats() {
    this.homeService.loadDashboardStats().subscribe((stats: any) => {
      this.numberOfEmployees = stats.numberOfEmployees;
      this.numberOfAttendants = stats.numberOfAttendants;
      this.monthlySalaryTotal = stats.monthlySalaryTotal;
      this.projectsOnboard = stats.projectsOnboard;
    });
  }
}