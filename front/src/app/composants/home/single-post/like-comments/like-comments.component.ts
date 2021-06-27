import { Component, Input, OnInit } from '@angular/core';
import { faHandRock, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { LikeService } from 'src/app/service/like.service';


@Component({
  selector: 'app-like-comments',
  templateUrl: './like-comments.component.html',
  styleUrls: ['./like-comments.component.scss']
})
export class LikeCommentsComponent implements OnInit {

  @Input() commentId:number;
  public faThumbsUp = faThumbsUp;
  public faHandRock = faHandRock;
  public commentLiked: boolean;
  public likeCommentNumber: {likes: [object]};

  constructor(private LikeService: LikeService) { }

  ngOnInit(): void {
    //appel des fonctions a l'initialisation du composant 
    this.getOneComment();
    this.getLikesComment();
  }
  likeCommentPost(){
    //abonnement au service 
    this.LikeService.likeComment(this.commentId).subscribe(() => {
      //rappel des fonction 
      this.getLikesComment();
      this.getOneComment();
    })
  }
  dislikeCommentPost(){
    this.LikeService.dislikeComment(this.commentId).subscribe(() => {
      this.getLikesComment();
      this.getOneComment();
    })
  }
  getLikesComment(){
    this.LikeService.getLikeComment(this.commentId).subscribe(isLiked => {
      this.commentLiked = isLiked;
    })
  }
  
  getOneComment(){
    this.LikeService.getOneComment(this.commentId).subscribe(like => {
      this.likeCommentNumber = like;
      console.log(this.likeCommentNumber);
      
    })
  }
}
