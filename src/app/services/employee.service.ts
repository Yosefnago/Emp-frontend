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

    private apiUrlEmployee = 'http://localhost:8090/employees';
    private apiUrlFiles = 'http://localhost:8090/files';
    private apiUrlSalary ='http://localhost:8090/salary';

    constructor(private http: HttpClient) {}

    loadAllEmployees() {
        return this.http.get<any[]>(
            `${this.apiUrlEmployee}/loadAll`
        );
    }
    addEmployee(request: AddEmployeeRequest) {
        
        return this.http.post(`${this.apiUrlEmployee}/addEmployee`,request);
    }

    loadEmployee(personalId:string){
        
        return this.http.get(`${this.apiUrlEmployee}/${personalId}`);
    }
    loadFiles(personalId:string){
        return this.http.get<any[]>(`${this.apiUrlFiles}/${personalId}`)
    }
    uploadFile(formData: FormData, personalId: string) {
        return this.http.post(
            `http://localhost:8090/files/upload/${personalId}`,
            formData
        );
    }
    downloadFile(fileName: string) {
        return this.http.get(
            `${this.apiUrlFiles}/download/${fileName}`,
            {
                responseType: 'blob'
            }
        );
    }
    deleteFile(fileName: string) {
        return this.http.delete(
            `${this.apiUrlFiles}/delete/${fileName}`
        );
    }
    showFile(fileId: number) {
        return this.http.get(
            `${this.apiUrlFiles}/show/${fileId}`,
            {
                responseType: 'blob'
            }
        );
    }
    loadEmployeeSalary(personalId: string) {
        return this.http.get(
            `${this.apiUrlSalary}/emp/${personalId}`
        );
    }
    
}