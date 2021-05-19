import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private postUrl = environment.postUrl;
  public messageId: String;
  public FormData: any;


  constructor(private httpClient: HttpClient){

  }

  getPost(): Observable<any>{
    return this.httpClient.get(`${this.postUrl}`);
  }
  writePost(content: string,attachment: File):Observable<any>{
    let formData = new FormData();  
    formData.append('content', content);
    formData.append('image', attachment, attachment.name);
    console.log(formData);
    
    return this.httpClient.post(this.postUrl + 'new',formData);
  }

  deletePost(id: number){
    return this.httpClient.delete(this.postUrl + id +'/delete')
  }

  
}