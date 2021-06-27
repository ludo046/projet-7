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
    //envoie des donner du formulaire au backend 
    let formData = new FormData();  
    formData.append('content', content);
    formData.append('image', attachment); 
    return this.httpClient.post(this.comment + id +'/comment/new',formData);
  }

  getComment(): Observable<any>{
    return this.httpClient.get(`${this.comment}`);
  }
  getOneComment(commentId: string):Observable<any>{
    return this.httpClient.get(`${this.comment}` + commentId)
  }
  deleteComment(id: number){
    return this.httpClient.delete(this.comment + id +'/delete')
  }
  updateComment(id: string, content: string, attachment: File){
    let formData = new FormData();
    formData.append('content', content),
    formData.append('image', attachment)
    return this.httpClient.put(this.comment+ id + '/modify/',formData)
  }
  
}