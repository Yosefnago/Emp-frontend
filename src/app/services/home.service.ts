import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class HomeService {
    
    private apiUrlEmployee = 'http://localhost:8090/employees';
    private apiUrlSalary ='http://localhost:8090/salary';
    private apiUrlDashboard = 'http://localhost:8090/dashboard';

    constructor(private http : HttpClient){}

    
    loadDashboardStats() {
        return this.http.get(
            `${this.apiUrlDashboard}/stats`
        );
    }
}