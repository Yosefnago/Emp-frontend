import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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

    public getSalaryDetails(employeeId: number): Observable<SalaryDetails> {
        return this.http.get<SalaryDetails>(`${this.apiUrl}/details/${employeeId}`);
    }

    public updateSalaryDetails(updateRequest: UpdateSalaryDetailsRequest, personalId: string) {
        return this.http.put(`${this.apiUrl}/update/${personalId}`, updateRequest);
    }

    public searchSalarySlips(personalId: string, year: number, month: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/slips/search?personalId=${personalId}&year=${year}&month=${month}`);
    }

    public getViewPdfUrl(salaryId: number): string {
        return `${this.apiUrl}/slips/view/${salaryId}`;
    }

    public getDownloadPdfUrl(salaryId: number): string {
        return `${this.apiUrl}/slips/download/${salaryId}`;
    }
    public getSalaryPdfBlob(salaryId: number, action: 'view' | 'download'): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/slips/${action}/${salaryId}`, {
            responseType: 'blob'
        });
    }
}