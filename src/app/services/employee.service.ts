import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


export interface AddEmployeeRequest {
  firstName: string;
  lastName: string;
  personalId: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  address: string;
  hireDate: string; 
}
@Injectable({
    providedIn: 'root'
})

export class EmployeeService {

    private apiUrl = 'http://localhost:8090/employees';

    constructor(private http: HttpClient) {}

    
    addEmployee(request: AddEmployeeRequest) {

        const token = sessionStorage.getItem('token') ?? '';

        return this.http.post(`${this.apiUrl}/addEmployee`,request,{headers: {Authorization: `Bearer ${token}`}});
    }
    
    
}