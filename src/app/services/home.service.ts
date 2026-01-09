import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LastActivity } from "../model";

@Injectable({
    providedIn: 'root'
})

export class HomeService {
    
    private apiUrlDashboard = 'http://localhost:8090/dashboard';

    constructor(private http : HttpClient){}

    
    loadDashboardStats() {
        return this.http.get(
            `${this.apiUrlDashboard}/stats`
        );
    }
    loadLastActivities(): Observable<LastActivity[]> {
        return this.http.get<LastActivity[]>(
            `${this.apiUrlDashboard}/activity`
        );
    }
}