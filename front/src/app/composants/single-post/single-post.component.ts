import { Component, Input } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent {

 @Input() allPost: any;
 public userId: any;
 connectUserId = JSON.parse(sessionStorage.getItem('session')).id; 

  constructor(private messageService: MessageService,
              private usersService: UsersService) { }

  ngOnInit(): void {  
    this.newPost();
    console.log(this.connectUserId);
    
  }
  
  newPost():void{
    this.messageService.getPost().subscribe(posts => {
      this.userId = posts
      console.log(this.userId);      
    });
  }
}
