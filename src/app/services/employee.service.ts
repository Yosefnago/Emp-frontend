import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AddEmployeeRequest, Employee, UpdateEmployeeRequest } from "../models/Employee";




@Injectable({
    providedIn: 'root'
})

export class EmployeeService {

    private apiUrlEmployee = 'http://localhost:8090/employees';
    private apiUrlFiles = 'http://localhost:8090/files';
    private apiUrlSalary ='http://localhost:8090/salary';

    constructor(private http: HttpClient) {}

    loadAllEmployees() {
        return this.http.get<Employee[]>(
            `${this.apiUrlEmployee}`
        );
    }
    addEmployee(request: AddEmployeeRequest) {
        return this.http.post(`${this.apiUrlEmployee}/add`,request);
    }

    getEmployeeByPersonalId(personalId:string){

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
    
}

