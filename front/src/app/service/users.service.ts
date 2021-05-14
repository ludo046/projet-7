import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreateUserRequest } from '../models/user.model';
import { LoginUser } from '../models/user.model'
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

private apiUrl = environment.apiUrl;
//private headerAuth = JSON.parse(sessionStorage.getItem('session')).token;
  
constructor(private httpClient: HttpClient,
                    private router: Router){}

createUser(CreateUserRequest: CreateUserRequest){
  return this.httpClient.post(`${this.apiUrl}users/register`,CreateUserRequest);
}

logUser(LoginUser: LoginUser){
  return this.httpClient.post(`${this.apiUrl}users/login`,LoginUser)
}

getUserProfile(){
  //let headers = new HttpHeaders({ 'Authorization': this.headerAuth });
  //return this.httpClient.get(`${this.apiUrl}users/me`)
}

}