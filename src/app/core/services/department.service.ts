import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {

    private apiUrl = 'http://localhost:8090/user';

    constructor(private http: HttpClient) { }

    
    addDepartment(department: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, department);
    }

    updateDepartment(department: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${department.id}`, department);
    }

    deleteDepartment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getDepartmentDetails(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

}
