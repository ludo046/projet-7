import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private postUrl = environment.postUrl;
  

  constructor(private httpClient: HttpClient) { }

  writeComment(content: string, id:number):Observable<any>{
    // let formData = new FormData();  
    // formData.append('content', content);
    //formData.append('image', attachment, attachment.name);
    //console.log(formData);
    
    return this.httpClient.post(this.postUrl + id +'/comment/new',{content});
  }
}
