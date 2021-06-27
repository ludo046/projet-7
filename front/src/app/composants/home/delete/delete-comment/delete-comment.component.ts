import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/service/comment.service';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.scss']
})
export class DeleteCommentComponent implements OnInit {

  @Input() commentId: number;
  public allComment: [];

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    //this.deleteComment()
    this.newComment()
  }
  //fonction de suppression d'un commentaire 
  deleteComment(){
    //abonnement au service 
    this.commentService.deleteComment(this.commentId).subscribe(() => {
      //rappel de la fonction de recuperation des commentaires
      this.newComment();
    })
  }
  //fontion de recuperation des commentaire 
  newComment(): void {
    this.commentService.getComment().subscribe((comments) => {
      this.allComment = comments;
    });
  }
}
