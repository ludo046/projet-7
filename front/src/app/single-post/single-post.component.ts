import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../service/message.service';
import { Message } from 'models'

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

  messageSub: Subscription;
  message: Message[];
  errorMsg: string;
  allmessage: any;

  

  constructor(
    private messageService : MessageService,
  ) { }

  ngOnInit(): void {

    this.messageService.getMessage().subscribe(value => {
      console.log(value);
      this.allmessage = value
      console.log(this.allmessage);
      
    })
    this.messageService.getMessage()
  }
  
  
}
