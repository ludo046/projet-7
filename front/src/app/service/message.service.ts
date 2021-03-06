import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
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
    //appel au backend pour recuperer une reponse dans le composant
    return this.httpClient.get(`${this.postUrl}`);
  }
  getOnePost(messageId: string):Observable<any>{
    return this.httpClient.get(`${this.postUrl}` + messageId)
  }
  writePost(content: string,attachment: File):Observable<any>{
    let formData = new FormData();  
      formData.append('content', content);
      formData.append('image', attachment);
    
    return this.httpClient.post(this.postUrl + 'new',formData);
  }

  deletePost(id: number){
    return this.httpClient.delete(this.postUrl + id +'/delete')
  }

  updatePost(messageId: string, content: string, attachment: File){
    let formdata = new FormData();
    formdata.append('content', content);
    formdata.append('image', attachment);
    return this.httpClient.put(this.postUrl + messageId + '/modify/',formdata)
  }
  getComment(): Observable<any>{
    return this.httpClient.get(`${this.postUrl}`);
  }
}