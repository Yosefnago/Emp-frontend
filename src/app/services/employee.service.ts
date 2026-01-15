import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


export interface AddEmployeeRequest {
    firstName: string,
    lastName: string,
    personalId: string,
    email: string,
    phone: string,
    address: string,
    position: string,
    department: string,
    hireDate: Date
    status: string
}

export interface UpdateEmployeeRequest {
    firstName: string;
    lastName: string;
    email: string;
    personalId: string;
    gender: string;
    birthDate: string;
    familyStatus: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    position: string;
    department: string;
    hireDate: string;
    jobType: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})

export class EmployeeService {

    private apiUrlEmployee = 'http://localhost:8090/employees';
    private apiUrlFiles = 'http://localhost:8090/files';
    private apiUrlSalary ='http://localhost:8090/salary';

    constructor(private http: HttpClient) {}

    loadAllEmployees() {
        return this.http.get<any[]>(
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