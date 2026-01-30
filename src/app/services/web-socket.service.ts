import { Injectable } from "@angular/core";
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from "rxjs";

export interface ConnectionStatus {
  connected: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private url = 'ws://localhost:8090/server-status';
  private client?: Client;
  private connectionStatus$ = new Subject<ConnectionStatus>();

  get connectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus$.asObservable();
  }

  get isConnected(): boolean {
    return this.client?.active ?? false;
  }

  connect(token: string): void {
    if (this.client?.active) {
      return;
    }


    this.client = new Client({
      brokerURL: this.url,
      
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000, 
      heartbeatOutgoing: 4000,
      
      onConnect: (frame) => {
        this.connectionStatus$.next({ connected: true });
      },

      onDisconnect: () => {
        this.connectionStatus$.next({ 
          connected: false, 
          error: 'Server connection lost' 
        });
      },

      onStompError: (frame) => {
        this.connectionStatus$.next({
          connected: false,
          error: frame.headers['message'] || 'STOMP error'
        });
      },

      onWebSocketClose: () => {
        this.connectionStatus$.next({ 
          connected: false,
          error: 'Server connection lost' 
        });
      },

      onWebSocketError: () => {
        this.connectionStatus$.next({ 
          connected: false, 
          error: 'WebSocket connection failed'
        });
      }
    });

    this.client.activate();
  }

  subscribe(destination: string, callback: (message: IMessage) => void) {
    if (!this.client?.active) {
      throw new Error('WebSocket not connected');
    }
    return this.client.subscribe(destination, callback);
  }

  send(destination: string, body: any): void {
    if (!this.client?.active) {
      throw new Error('WebSocket not connected');
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
      this.connectionStatus$.next({ connected: false });
    }
  }
}