import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuditLog } from "../models/AuditLog";



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