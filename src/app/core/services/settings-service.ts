import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private apiUrl = 'http://localhost:8090/user';

    constructor(private http: HttpClient) { }

    getUserProfile(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    updateUserProfile(profileData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}`, profileData);
    }

    updateSecuritySettings(securityData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/security`, securityData);
    }

    updateNotificationSettings(notificationSettings: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/notifications`, notificationSettings);
    }



}    