import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { WebSocketService } from './services/web-socket.service';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from './services/auth-service';

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
    private ws: WebSocketService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    
    
    const hasToken = this.authService.hasAccessToken();
    
    if (!hasToken) {
      
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      ).subscribe(() => {
        
        if (!this.authService.hasAccessToken() && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    
    this.ws.connect();
    
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

