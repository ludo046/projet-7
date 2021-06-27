import { Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.scss']
})
export class ModifyPostComponent implements OnInit {

  private modifyPost: FormGroup;
  @Input() postId: number;
  public file: File;
  public onePost:[];

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService) { }

  ngOnInit(): void {
    //appel de la fonction a l'initialisation du composant 
    this.getOnePost();
    //reactive form
    this.modifyPost = this.formBuilder.group({
      //controle des champ du formulaire
      modifycontent: this.formBuilder.control('',(Validators.required)),
      modifyattachment:this.formBuilder.control('')
    });
  }


  updatePost(){
    //recuperation des valeur du formulaire 
    const content = this.modifyPost.get('modifycontent').value;
    //recuperation de l'id du post dans d'url 
    const messageId = window.location.href.split('post/')[1]
    const attachment = this.file;
    //abonnement au service 
    this.messageService.updatePost(messageId, content, attachment).subscribe()
  }

  getOnePost(){
    const messageId = window.location.href.split('post/')[1];
    this.messageService.getOnePost(messageId).subscribe(singlePost => {
      this.onePost = singlePost; 
    })
  }

  onFileAdded(event: Event) {
    //recuperation du fichier ci il yen a un 
    this.file = (event.target as HTMLInputElement).files[0];
  }

}


