import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatIconModule,MatButtonModule],
  template: `<router-outlet></router-outlet>`
})
export class App implements OnInit{

  constructor(private router: Router){}

  ngOnInit(): void {
    if(sessionStorage.getItem('token') === null){
      this.router.navigate(['/login']);
      
    }
  }


}

