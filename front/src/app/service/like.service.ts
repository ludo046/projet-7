import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private likeUrl = environment.postUrl;

  constructor(private httpClient: HttpClient){}

  likePost(id: number){
    return this.httpClient.post(this.likeUrl + id +'/like',{id})
  }
}