import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.scss']
})
export class DeletePostComponent implements OnInit {

  @Input() postId:number;
  public allPost: [];

  constructor(private messageService: MessageService,
              private homeComponent: HomeComponent) { }

  ngOnInit(): void {
    //appel de la fonction a l'initialisation du composant 
    //this.newPost()
  }
  //fonction de suppression d'un post 
  deletePost(){
    //abonnement au service
    this.messageService.deletePost(this.postId).subscribe(() => {
      //appel de la fonction de chargement des post
      //this.messageService.getPost();
      this.homeComponent.newPost();
    })
  }
 //fonction de chargement des post 
  newPost(){
    this.messageService.getPost().subscribe((posts) => {
      this.allPost = posts;
    });
  }

}
