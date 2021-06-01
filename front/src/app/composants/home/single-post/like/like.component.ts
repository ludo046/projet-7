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
  constructor( private LikeService: LikeService) { }

  

  ngOnInit(): void {
  }

  likePost(){
    this.LikeService.likePost(this.postId).subscribe(() => this.newLike.emit(true))
  }
  dislikePost(){
    this.LikeService.dislike(this.postId).subscribe()
  }
}