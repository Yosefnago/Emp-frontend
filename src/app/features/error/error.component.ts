

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  
  errorMessage: string = 'An unexpected error occurred.';
  errorTitle: string = 'Service Unavailable';

  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.errorMessage = params['message'];
      }
    });
  }
  goToLogin() {
    sessionStorage.clear(); 
    this.router.navigate(['/login']);
  }
}