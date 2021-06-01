import { Component, OnInit,Output } from '@angular/core';
import { CommentService } from 'src/app/service/comment.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Output() allPost: any;
  @Output() allComment: any;


  constructor( private messageService: MessageService,
               private commentService: CommentService) { }

  ngOnInit() {
    this.newPost();
  }

  newPost():void{
    this.messageService.getPost().subscribe(posts => {
      this.allPost = posts;
    });
  }
  newComment():void{
    this.commentService.getComment().subscribe(comments => {
    });
  }
}
