import { Injectable } from "@angular/core";
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

export interface ConnectionStatus {
  connected: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private readonly WS_URL = 'ws://localhost:8090/server-status';
  private client?: Client;
  private connectionStatus$ = new BehaviorSubject<ConnectionStatus>({ connected: false });
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private authService: AuthService) { }

  get connectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus$.asObservable();
  }

  get isConnected(): boolean {
    return this.client?.active ?? false;
  }

  connect(): void {
    if (this.client?.active) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.connectionStatus$.next({
        connected: false,
        error: 'User not logged in'
      });
      return;
    }

    this.connectWithCookies();
  }

  private connectWithCookies(): void {
    this.client = new Client({
      brokerURL: this.WS_URL,

      reconnectDelay: 0,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame) => {
        this.reconnectAttempts = 0;
        this.connectionStatus$.next({ connected: true });
      },

      onDisconnect: () => {
        this.connectionStatus$.next({
          connected: false,
          error: 'Server connection lost'
        });
      },

      onStompError: (frame) => {
        const errorMessage = frame.headers['message'] || 'STOMP error';

        if (errorMessage.includes('expired') || errorMessage.includes('Token') || errorMessage.includes('Access denied')) {
          this.handleTokenExpiration();
        } else {
          this.connectionStatus$.next({
            connected: false,
            error: errorMessage
          });
        }
      },

      onWebSocketClose: (event) => {
        this.connectionStatus$.next({
          connected: false,
          error: 'Server connection lost'
        });
      },

      onWebSocketError: (event) => {
        this.connectionStatus$.next({
          connected: false,
          error: 'WebSocket connection failed'
        });
      }
    });

    this.client.activate();
  }

  private handleTokenExpiration(): void {
    this.reconnectAttempts++;

    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      this.connectionStatus$.next({
        connected: false,
        error: 'Failed to reconnect after multiple attempts'
      });
      return;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = undefined;
    }

    this.authService.refresh().subscribe({
      next: () => {
        this.connectWithCookies();
      },
      error: (err) => {
        this.connectionStatus$.next({
          connected: false,
          error: 'Authentication failed - please login again'
        });
      }
    });
  }

  subscribe(destination: string, callback: (message: IMessage) => void) {
    if (!this.client?.active) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }
    return this.client.subscribe(destination, callback);
  }

  send(destination: string, body: any): void {
    if (!this.client?.active) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }
    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = undefined;
      this.reconnectAttempts = 0;
      this.connectionStatus$.next({ connected: false });
    }
  }
}