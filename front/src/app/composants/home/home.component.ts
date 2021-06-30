import { Component, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ne } from 'sequelize/types/lib/operators';
import { CommentService } from 'src/app/service/comment.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() allPost: [];
  @Output() allComment: [];
  //allposts = new BehaviorSubject()
  

  constructor(
    private messageService: MessageService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    //appel de la fonction a l'initialisation du composant 
    this.newPost();
  }

  newPost(): void {
    //abonnement au service et recuperation de la repose du backend
    this.messageService.getPost().subscribe((posts) => {
      this.allPost = posts;
      let allposts = new BehaviorSubject(posts)
    });
  }
  newComment(): void {
    this.commentService.getComment().subscribe((comments) => {
      this.allComment = comments;
    });
  }
}
