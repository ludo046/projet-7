import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private headerAuth = JSON.parse(sessionStorage.getItem('session')).token;
  private likeUrl = environment.postUrl;

  constructor(private httpClient: HttpClient){}

  likePost(id: number){
    //let headers = new HttpHeaders({ 'Authorization': headerAuth });
    return this.httpClient.post(this.likeUrl + id +'/like',{id})
  }
}