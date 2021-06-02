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

  writeComment(content: string, attachment:File, id:number):Observable<any>{
    let formData = new FormData();  
    formData.append('content', content);
    formData.append('image', attachment); 
    return this.httpClient.post(this.comment + id +'/comment/new',formData);
  }

  getComment(): Observable<any>{
    return this.httpClient.get(`${this.comment}`);
  }
  deleteComment(id: number){
    return this.httpClient.delete(this.comment + id +'/delete')
  }
  updateComment(id: string, content: string){
    return this.httpClient.put(this.comment+ id + '/modify/',{content})
  }
}