import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { WebSocketService } from './services/web-socket.service';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatIconModule,MatButtonModule],
  template: `<router-outlet></router-outlet>`
})
export class App implements OnInit, OnDestroy {

  private wsSubscription?: Subscription;
  private isInitialConnection = true;

  constructor(
    private router: Router, 
    private ws: WebSocketService
  ) {}

  ngOnInit(): void {
    const tk = sessionStorage.getItem('token');
    
    if (tk === null) {

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)

      ).subscribe(() => {

        if (!sessionStorage.getItem('token') && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
        
      });
      return;
    }

    this.ws.connect(tk);
    
    this.wsSubscription = this.ws.connectionStatus.subscribe(status => {
      if (this.isInitialConnection) {
        if (status.connected) {
          this.isInitialConnection = false;
        }
        return;
      }

      if (!status.connected && status.error) {
        sessionStorage.clear();
        this.router.navigate(['/error'], { 
          queryParams: { message: 'Server is currently unavailable. Please try again later.' }
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.ws.disconnect();
  }

}

