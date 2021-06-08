import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faHandRock, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { LikeService } from 'src/app/service/like.service';


@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {
  faThumbsUp = faThumbsUp;
  faHandRock = faHandRock;
  @Input() postId:number;
  @Output() newLike = new EventEmitter<boolean>();
  messageLiked: boolean;
  userIdConnect;

  constructor( private LikeService: LikeService) { }

  messageLikes: []

  ngOnInit(): void {
    this.getLikes()
    this.userIdConnect = JSON.parse(sessionStorage.getItem('session')).userId
  }

  likePost(){
    this.LikeService.likePost(this.postId).subscribe(() => {
      this.newLike.emit(true);
      this.getLikes();
    })
  }
  dislikePost(){
    this.LikeService.dislike(this.postId).subscribe(()=> 
      this.getLikes()
    )
  }
  getLikes(){
    this.LikeService.getLike(this.postId).subscribe(isLiked => 
      this.messageLiked = isLiked
    )
    
    
  }

}