import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreateUserRequest, UpdateUser } from '../models/user.model';
import { LoginUser } from '../models/user.model'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

private apiUrl = environment.apiUrl;
public updateUserFormData: any;
  
constructor(private httpClient: HttpClient){}

createUser(CreateUserRequest: CreateUserRequest){
  return this.httpClient.post(`${this.apiUrl}users/register`,CreateUserRequest);
}

logUser(LoginUser: LoginUser){
  return this.httpClient.post(`${this.apiUrl}users/login`,LoginUser)
}

getUserProfile(): Observable<any>{
  return this.httpClient.get(`${this.apiUrl}users/me`)
}

deleteUser(){
  return this.httpClient.delete(`${this.apiUrl}users/delete`)
}

// updateUserProfile(picture: File, firstname: string, lastname:string, email:string, datebirth:string ){
//     let updateUserFormData = new FormData();
//     updateUserFormData.append('image',picture, picture.name)
//     return this.httpClient.put(`${this.apiUrl}users/me`, {updateUserFormData, firstname, lastname, email, datebirth})
//   }
updateUserProfile(firstname: string, lastname:string, email:string, datebirth:string, picture: File):Observable<any>{
  let formData = new FormData();  
  formData.append('firstname', firstname);
  formData.append('lastname', lastname);
  formData.append('email', email);
  formData.append('datebirth', datebirth);
  formData.append('image', picture, picture.name);
  console.log(formData);
  
  return this.httpClient.put(`${this.apiUrl}users/me`,formData);
}

}