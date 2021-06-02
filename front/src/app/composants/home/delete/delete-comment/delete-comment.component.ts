import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/service/comment.service';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.scss']
})
export class DeleteCommentComponent implements OnInit {

  @Input() commentId: number;

  constructor(private commentService: CommentService,) { }

  ngOnInit(): void {
  }
  deleteComment(){
    this.commentService.deleteComment(this.commentId).subscribe()
    console.log(this.commentId);
    
  }
}
