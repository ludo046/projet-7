import { Component, OnInit,Output } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Output() allPost: any;


  constructor( private messageService: MessageService) { }

  ngOnInit() {
    this.newPost();
  }

  newPost():void{
    this.messageService.getPost().subscribe(posts => {
      this.allPost = posts;
      console.log(this.allPost);
    });
  }
}
