import { Component, Input, OnInit } from '@angular/core';
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
  @Input() like: number;
  constructor( private LikeService: LikeService) { }

  

  ngOnInit(): void {
  }

  likePost(){
    this.LikeService.likePost(this.postId).subscribe()
  }
  dislikePost(){
    this.LikeService.likePost(this.postId).subscribe()
  }
}