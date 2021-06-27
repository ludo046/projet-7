import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private likeUrl = environment.postUrl;
  private commentUrl = environment.comment;
  private like = environment.likes;
  private postUrl = environment.postUrl;
  private commentLike = environment.likeComment;

  constructor(private httpClient: HttpClient){}

  likePost(id: number){
    //envoie les données au backend
    return this.httpClient.post(this.likeUrl + id +'/like',{id})
  }
  dislike(id: number){
    return this.httpClient.post(this.likeUrl + id +'/dislike',{id})
  }

  likeComment(id: number){
    return this.httpClient.post(this.commentUrl + id +'/like',{id})
  }
  dislikeComment(id: number){
    return this.httpClient.post(this.commentUrl + id +'/dislike',{id})
  }
  getLike(messageId: number): Observable<any>{
    //appel au backend pour recuperer une reponse dans le composant
    return this.httpClient.get(this.like + messageId);
  }
  getOnePost(messageId: number):Observable<any>{
    return this.httpClient.get(`${this.postUrl}` + messageId)
  }
  getLikeComment(commentId: number): Observable<any>{
    return this.httpClient.get(this.commentLike + commentId);
  }
  getOneComment(commentId: number):Observable<any>{
    return this.httpClient.get(`${this.commentUrl}` + commentId);
  }
}