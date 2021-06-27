import { Component, Input, OnInit} from '@angular/core';
import { faHandRock, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { LikeService } from 'src/app/service/like.service';



@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {
  public faThumbsUp = faThumbsUp;
  public faHandRock = faHandRock;
  @Input() postId:number;
  public messageLiked: boolean;
  public likeNumber: {likes: [object]};
  public userIdConnect;
  public messageLikes: [];

  constructor( private LikeService: LikeService) { }

  

  ngOnInit(): void {
    //appel des fonctions a l'initialisation du composant 
    this.getOnePost();
    this.getLikes();
    //recuperation du userId a l'initialisation du composant 
    this.userIdConnect = JSON.parse(sessionStorage.getItem('session')).userId;
  }

  likePost(){
    //abonnement au service 
    this.LikeService.likePost(this.postId).subscribe(() => {
      //rappel des fonctions 
      this.getLikes();
      this.getOnePost();
    })
  }
  dislikePost(){
    this.LikeService.dislike(this.postId).subscribe(()=>{
      this.getLikes()
      this.getOnePost()
    })
  }
  getLikes(){
    this.LikeService.getLike(this.postId).subscribe(isLiked => {
      this.messageLiked = isLiked;
    })
  }
  
  getOnePost(){
    this.LikeService.getOnePost(this.postId).subscribe(like => {
      this.likeNumber = like;
      console.log(this.likeNumber);
    })
  }

}