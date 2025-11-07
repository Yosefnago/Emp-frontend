import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class RegisterService{
  private apiUrl = 'http://localhost:8090/auth/register';

  constructor(private http : HttpClient) {}

  register(username:string,password :string):Observable<any>{
    return this.http.post(this.apiUrl,{username,password});
  }

}
