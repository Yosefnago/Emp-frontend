import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Salary } from "../models/Salary";
import { SalaryDetails, UpdateSalaryDetailsRequest } from "../models/SalaryDetails";

@Injectable({
    providedIn: 'root'
})
export class SalaryService {

    public apiUrl = 'http://localhost:8090/salary';

    constructor(private http: HttpClient) { }

    public getSalariesByYearAndMonth(year: number, month: number): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/${year}/${month}`
        );
    }

    public getSalaryHistory(employeeId: number): Observable<Salary[]> {
        return this.http.get<Salary[]>(`${this.apiUrl}/history/${employeeId}`);
    }

    public getSalaryDetails(employeeId: number): Observable<SalaryDetails> {
        return this.http.get<SalaryDetails>(`${this.apiUrl}/details/${employeeId}`);
    }

    public updateSalaryDetails(updateRequest: UpdateSalaryDetailsRequest, personalId: string) {
        return this.http.put(`${this.apiUrl}/update/${personalId}`, updateRequest);
    }

}