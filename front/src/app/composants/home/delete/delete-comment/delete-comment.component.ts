import { Component, Input} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommentService } from 'src/app/service/comment.service';
import { MessageService } from 'src/app/service/message.service';
import { HomeComponent } from '../../home.component';
import { ModifyCommentComponent } from '../../modify/modify-comment/modify-comment.component';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.scss']
})
export class DeleteCommentComponent{

  @Input() commentId: number;


  constructor(private commentService: CommentService,
              private messageService: MessageService,
              private homeComponent: HomeComponent,
) { }

  //fonction de suppression d'un commentaire 
  deleteComment(){  
    //abonnement au service 
    this.commentService.deleteComment(this.commentId).subscribe(() => {
      //rappel de la fonction de recuperation des commentaires
      this.homeComponent.newComment();
      console.log(this.homeComponent.newComment());
      
    })
  }
}
