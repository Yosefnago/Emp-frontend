import { Injectable } from "@angular/core";
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

export interface ConnectionStatus {
  connected: boolean;
  error?: string;
}

/**
 * WebSocket service that manages STOMP connections with JWT authentication.
 * Handles token expiration by reconnecting with fresh tokens.
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private readonly WS_URL = 'ws://localhost:8090/server-status';
  private client?: Client;
  private connectionStatus$ = new BehaviorSubject<ConnectionStatus>({ connected: false });
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private authService: AuthService) { }

  /**
   * Observable stream of connection status changes.
   */
  get connectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus$.asObservable();
  }

  /**
   * Checks if WebSocket is currently connected.
   */
  get isConnected(): boolean {
    return this.client?.active ?? false;
  }

  /**
   * Establishes WebSocket connection with JWT authentication.
   * Uses the current access token from AuthService.
   * 
   * If already connected, this method does nothing.
   */
  connect(): void {

    if (this.client?.active) {
      return;
    }

    // Get current access token
    const token = this.authService.getAccessToken();

    if (!token) {

      this.connectionStatus$.next({
        connected: false,
        error: 'No access token available'
      });
      return;
    }

    this.connectWithToken(token);
  }

  /**
   * Internal method to establish WebSocket connection with a specific token.
   * 
   * @param token JWT access token for authentication
   */
  private connectWithToken(token: string): void {
    this.client = new Client({
      brokerURL: this.WS_URL,

      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },

      // Reconnection settings
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

        if (errorMessage.includes('expired') || errorMessage.includes('Token')) {
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

  /**
   * Handles token expiration by refreshing and reconnecting.
   * If refresh fails or max attempts reached, gives up.
   */
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
      next: (newToken) => {
        this.connectWithToken(newToken);
      },
      error: (err) => {
        this.connectionStatus$.next({
          connected: false,
          error: 'Authentication failed - please login again'
        });

      }
    });
  }

  /**
   * Subscribes to a WebSocket destination/topic.
   * 
   * @param destination destination to subscribe to (e.g., '/topic/server-status')
   * @param callback function to call when message received
   * @returns subscription object that can be used to unsubscribe
   */
  subscribe(destination: string, callback: (message: IMessage) => void) {
    if (!this.client?.active) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }

    return this.client.subscribe(destination, callback);
  }

  /**
   * Sends a message to a WebSocket destination.
   * 
   * @param destination destination to send to
   * @param body message body (will be JSON stringified)
   */
  send(destination: string, body: any): void {
    if (!this.client?.active) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  /**
   * Disconnects from WebSocket server.
   * Cleans up client and updates connection status.
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = undefined;
      this.reconnectAttempts = 0;
      this.connectionStatus$.next({ connected: false });
    }
  }
}