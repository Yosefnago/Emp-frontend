import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from '../../core/auth/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  isSidebarCollapsed = true;
  username = '';
  currentRoute = 'dashboard';
  numberOfEmployees = 0;
  numberOfAttendants = 0;
  monthlySalaryTotal = 0;
  projectsOnboard = 0;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    // Initialize active state from current URL (handles refresh / direct navigation)
    const urlParts = this.router.url.split('/');
    this.currentRoute = urlParts[urlParts.length - 1]?.split('?')[0] || 'dashboard';

    // Keep tracking on subsequent navigations
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const parts = event.urlAfterRedirects.split('/');
        this.currentRoute = parts[parts.length - 1]?.split('?')[0] || 'dashboard';
      });
    this.getUsername();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateTo(route: string) {
    this.currentRoute = route;
    this.router.navigate(['/home', route]);
  }

  onLogout() {
    this.loginService.logout()
    this.router.navigate(['/login']);
  }
  getUsername() {

    const storedName = sessionStorage.getItem('username');
    if (storedName) {
      this.username = storedName;
    }

  }
}