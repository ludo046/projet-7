import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router'


@Injectable({
    providedIn: 'root'
})
export class UsersService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  userId: string;

  constructor(private http: HttpClient,
              private router: Router) {}

  createUser(firstName: string, lastName: string, password: string, email: string, dateBirth: number, picture: string){//firstName: string, lastName: string, password: string, email: string, birthDate: number, picture: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8080/api/users/register',{firstName, lastName, password, email, dateBirth, picture}).subscribe( //{firstName: firstName, lastName: lastName, password: password, email: email, birthDate: birthDate, picture: picture}).subscribe(
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

  logout() {
    this.authToken = null;
    this.userId = null;
    this.isAuth$.next(false);
    this.router.navigate(['/signup']);
  }
}