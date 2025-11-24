import { Injectable } from "@angular/core";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private ws: WebSocket | null = null;
    private url = 'ws://localhost:8090/server-status';

    constructor(private router: Router){}

    connect(token :string):void{

        const connectionUrlWithToken = `${this.url}?token=${token}`;
        
        if(this.ws && this.ws.readyState === WebSocket.OPEN){
            this.ws.close();
        }

        this.ws = new WebSocket(connectionUrlWithToken);

        this.ws.onopen = () => {
            console.log("WS connected successfully via service.");
        }

        this.ws.onclose = () => {
            console.log("WS connection closed.");

            console.warn("Server connection lost. Redirecting to error page.");

            this.router.navigate(['/error'], { 
                queryParams: { message: 'Lost connection to the server' } 
            });
        };
        this.ws.onerror = (error) => {
            console.error("WS error:", error);
            this.router.navigate(['/error'], { 
                queryParams: { message: 'Connection failure' } 
            });
        };

    }
    disconnect(): void {

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}