import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient,
              private UsersService: UsersService
) { }


  postMessage(content: string, headerAuth:string){
    let headers = new HttpHeaders ({'Authorization' : headerAuth});

    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8080/api/message/new',{content},{headers}).subscribe(
        (response: {message:string}) => {
          resolve(response)
        },
        (error) => {
          reject(error)
        } 
      );
    });
  }

  getMessage(){
    return this.http.get('http://localhost:8080/api/message',{
      params: new HttpParams().set(
        "auth-token", this.UsersService.authToken  
      ) 
    })
  }

}