import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.scss']
})
export class DeletePostComponent implements OnInit {

  @Input() postId:number;
  allPost: [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    //appel de la fonction a l'initialisation du composant 
    this.newPost()
  }
  //fonction de suppression d'un post 
  deletePost(){
    //abonnement au service
    this.messageService.deletePost(this.postId).subscribe(() => {
      //appel de la fonction de chargement des post 
      this.newPost()
    })
  }
 //fonction de chargement des post 
  newPost(): void {
    this.messageService.getPost().subscribe((posts) => {
      this.allPost = posts;
    });
  }

}
