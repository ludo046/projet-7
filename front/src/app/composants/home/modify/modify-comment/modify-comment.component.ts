import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/service/comment.service';

@Component({
  selector: 'app-modify-comment',
  templateUrl: './modify-comment.component.html',
  styleUrls: ['./modify-comment.component.scss']
})
export class ModifyCommentComponent implements OnInit {

  modifyComment: FormGroup;
  file: File;
  oneComment: [];

  constructor(private formBuilder: FormBuilder,
              private commentService: CommentService) { }

  ngOnInit(): void {
    //appel de la fonction a l'initialisation du composant 
    this.getOneComment();
    //reactive form
    this.modifyComment = this.formBuilder.group({
      //controle des champs 
      content: this.formBuilder.control('',(Validators.required)),
      attachment:this.formBuilder.control('')
    });
  }
  updateComment(){
    //recupération des valeur du formulaire 
    const content = this.modifyComment.get('content').value;
    const commentId = window.location.href.split('comment/')[1]
    const attachment = this.file
  
    this.commentService.updateComment(commentId, content, attachment).subscribe()
  }

  getOneComment(){
    //recuperation de l'id du commentaire dans l'url 
    const commentId = window.location.href.split('comment/')[1];
    //abonnement au service et recuperation de la reponse du backend
    this.commentService.getOneComment(commentId).subscribe(singlePost => {
      this.oneComment = singlePost;
    })
  }

  onFileAdded(event: Event) {
    //recuperation de la photo, ou video
    this.file = (event.target as HTMLInputElement).files[0];
  }
}
