import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private likeUrl = environment.postUrl;
  private commentUrl = environment.comment
  private like = environment.likes

  constructor(private httpClient: HttpClient){}

  likePost(id: number){
    return this.httpClient.post(this.likeUrl + id +'/like',{id})
  }
  dislike(id: number){
    return this.httpClient.post(this.likeUrl + id +'/dislike',{id})
  }

  likeComment(id: number){
    return this.httpClient.post(this.commentUrl + id +'/like',{id})
  }
  dislikeComment(id: number){
    return this.httpClient.post(this.commentUrl + id +'dislike',{id})
  }
  getLike(): Observable<any>{
    return this.httpClient.get(this.like);
  }
}