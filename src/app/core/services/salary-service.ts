import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({
    providedIn: 'root'
})
export class SalaryService {
  
    private apiUrl = 'http://localhost:8090/salary/'; 
  
    constructor(private http: HttpClient) {}  

    public getSalariesByYearAndMonth(year: number, month: number) {
        return this.http.get<any>(
            `${this.apiUrl}${year}/${month}`
        );
    }

}