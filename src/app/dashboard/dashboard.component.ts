import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  username = sessionStorage.getItem('username') || 'משתמש';
  showEmployeesMenu = false;
  private closeTimeout: any;
  constructor(private router: Router) {}

  toggleEmployeesMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showEmployeesMenu = !this.showEmployeesMenu;
  }

  closeMenuDelayed() {
    this.closeTimeout = setTimeout(() => {
      this.showEmployeesMenu = false;
    }, 400);
  }

  closeMenu() {
    clearTimeout(this.closeTimeout);
    this.showEmployeesMenu = false;
  }

  @HostListener('document:click')
  closeOnOutsideClick() {
    this.showEmployeesMenu = false;
  }


  ngOnInit() {
    const token = sessionStorage.getItem('token');


    if (!token) {
      this.router.navigate(['/login']);
    }

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      this.router.navigate(['/login']);
    });
  }

  logout() {

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');


    this.router.navigate(['/login']);
  }

}
