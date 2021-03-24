import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router'
import { CreateUserRequest } from '../models/user.model';


@Injectable({
    providedIn: 'root'
})
export class UsersService {
  isAuth$ = new BehaviorSubject<boolean>(false);
   authToken: string;
  private userId: string;

  constructor(private http: HttpClient,
              private router: Router) {}

  createUser(request: CreateUserRequest){

    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8080/api/users/register',request).subscribe( 
        (response: { message: string }) => {
          resolve(response);       
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('http://localhost:8080/api/users/login', {password: password, email: email}).subscribe(
        (response: {userId: string, token: string}) => {
          this.userId = response.userId;
          this.authToken = response.token;
          
          this.isAuth$.next(true);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}