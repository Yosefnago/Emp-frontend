import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class HomeService {
    
    private apiUrlEmployee = 'http://localhost:8090/employees';
    private apiUrlSalary ='http://localhost:8090/salary';

    constructor(private http : HttpClient){}

    loadNumberOfEmployees() {
        return this.http.get<number>(
            `${this.apiUrlEmployee}/loadNumberOfEmployees`
        );
    }

    loadTotalSalaries() {
        return this.http.get<number>(
            `${this.apiUrlSalary}/salaries`
        );
    }
}