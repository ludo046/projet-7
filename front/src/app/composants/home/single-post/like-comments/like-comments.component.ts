import { Component, Input, OnInit } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { LikeService } from 'src/app/service/like.service';

@Component({
  selector: 'app-like-comments',
  templateUrl: './like-comments.component.html',
  styleUrls: ['./like-comments.component.scss']
})
export class LikeCommentsComponent implements OnInit {

  @Input() commentId:number;
  faThumbsUp = faThumbsUp;

  constructor(private LikeService: LikeService) { }

  ngOnInit(): void {
  }
  likeCommentPost(){
    this.LikeService.likeComment(this.commentId).subscribe()
  }
  dislikeCommentPost(){
    this.LikeService.dislikeComment(this.commentId).subscribe()
  }

}
