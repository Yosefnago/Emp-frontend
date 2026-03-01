import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AddEmployeeRequest, Employee, UpdateEmployeeRequest } from "../models/Employee";
import { Observable } from "rxjs";




@Injectable({
    providedIn: 'root'
})

export class EmployeeService {

    private apiUrlEmployee = 'http://localhost:8090/employees';

    constructor(private http: HttpClient) { }

    loadAllEmployees() {
        return this.http.get<Employee[]>(
            `${this.apiUrlEmployee}`
        );
    }
    addEmployee(request: AddEmployeeRequest) {
        return this.http.post(`${this.apiUrlEmployee}/add`, request);
    }

    getEmployeeByPersonalId(personalId: string) {

        return this.http.get(`${this.apiUrlEmployee}/${personalId}`);
    }
    deleteEmployee(personalId: string) {
        return this.http.delete(`${this.apiUrlEmployee}/${personalId}`, {});
    }
    updateEmployee(updatedData: UpdateEmployeeRequest, personalId: string) {
        return this.http.put(
            `${this.apiUrlEmployee}/${personalId}`,
            updatedData
        );
    }
    public getCurrentMonthAttendanceStats(personalId: string): Observable<any> {
        return this.http.get<any>(`http://localhost:8090/attendance/stats/current-month/${personalId}`);
    }

}

