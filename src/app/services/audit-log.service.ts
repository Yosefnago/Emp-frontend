import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuditLog } from "../model";
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class AuditLogService {

    private apiUrlAuditLogs = 'http://localhost:8090/logs';
    constructor(private http: HttpClient){}

    loadAllLogs():Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(
            `${this.apiUrlAuditLogs}/all`
        );
    }
}