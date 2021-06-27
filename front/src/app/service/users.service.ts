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
  //envoie les informations au backend
  return this.httpClient.post(`${this.apiUrl}users/register`,CreateUserRequest);
}

logUser(LoginUser: LoginUser){
  return this.httpClient.post(`${this.apiUrl}users/login`,LoginUser)
}

getUserProfile(): Observable<any>{
  //appel au backend pour recuperer une reponse dans le composant
  return this.httpClient.get(`${this.apiUrl}users/me`)
}

deleteUser(){
  return this.httpClient.delete(`${this.apiUrl}users/delete`)
}

updateUserProfile(firstname: string, lastname:string, email:string, datebirth:string, picture: File):Observable<any>{
  let formData = new FormData();  
  formData.append('firstname', firstname);
  formData.append('lastname', lastname);
  formData.append('email', email);
  formData.append('datebirth', datebirth);
  formData.append('image', picture, picture.name);
  
  return this.httpClient.put(`${this.apiUrl}users/me`,formData);
}

}