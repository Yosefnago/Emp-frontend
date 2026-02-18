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

    public updateUserProfile(userId: number, profileData: any) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });     
    }



}    