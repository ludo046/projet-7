import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  userId: string;

  constructor(private http: HttpClient,
              private userService: UsersService,
              private router: Router) { }


  postMessage(content: string, userId:string){
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8080/api/message/new',{content,userId}).subscribe(
        (response: {message:string}) => {
          resolve(response)
        },
        (error) => {
          reject(error)
        } 
      );
    });
  }
}