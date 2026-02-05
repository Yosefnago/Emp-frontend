import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AttendanceRecord, EmployeeOption, SearchQuery } from "../models/Attendance";


@Injectable({
    providedIn: 'root'
})

export class AttendanceService {

    private apiUrl = 'http://localhost:8090/attendance';

    constructor(private http: HttpClient) { }

    loadAttendanceRecords(request: SearchQuery) {
        return this.http.post<any[]>(
            `${this.apiUrl}/records`,
            request
        );
    }
    loadMapOfEmployees() {
        return this.http.get<EmployeeOption[]>(
            `${this.apiUrl}/employees`
        );
    }
    updateAttendanceRecord(record: AttendanceRecord) {

        return this.http.put<AttendanceRecord>(
            `${this.apiUrl}/${record.personalId}`,
            record
        );

    }
}