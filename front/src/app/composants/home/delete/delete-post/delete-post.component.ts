import { Component, Input} from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.scss']
})
export class DeletePostComponent {

  @Input() postId:number;
  public allPost: [];

  constructor(private messageService: MessageService,
              private homeComponent: HomeComponent) { }

  //fonction de suppression d'un post 
  deletePost(){
    //abonnement au service
    this.messageService.deletePost(this.postId).subscribe(() => {
      //appel de la fonction de chargement des post
      this.homeComponent.newPost();
    })
  }

}
