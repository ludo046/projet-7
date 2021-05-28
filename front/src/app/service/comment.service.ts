import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private comment = environment.comment;
  

  constructor(private httpClient: HttpClient) { }

  writeComment(content: string, id:number):Observable<any>{
    return this.httpClient.post(this.comment + id +'/comment/new',{content});
  }

  getComment(): Observable<any>{
    return this.httpClient.get(`${this.comment}`);
  }
}
