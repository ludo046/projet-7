import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { LikeService } from 'src/app/service/like.service';


@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {
  faThumbsUp = faThumbsUp;
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

    // if(this.userId === this.userIdConnect || this.isLike === 0){
    //   this.LikeService.likePost(this.postId).subscribe(() => this.newLike.emit(true))
    // } else {
    //   this.LikeService.dislike(this.postId).subscribe(() => this.newLike.emit(true))
    // }
    // console.log(this.userId);
    // console.log(this.isLike);
    
    
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