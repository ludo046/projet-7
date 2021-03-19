import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/service/message.service';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-write-message',
  templateUrl: './write-message.component.html',
  styleUrls: ['./write-message.component.scss']
})
export class WriteMessageComponent implements OnInit {
  fullPathname='assets/images/icon.png'

  createMessage: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private userService: UsersService,
              private route: Router) { }

  ngOnInit(): void {
    this.createMessage = this.formBuilder.group({
      createOneMessage: this.formBuilder.control('',(Validators.required))
      
    })
  }

  postMessage():void{
    const content = this.createMessage.get('createOneMessage').value
    const userId = this.userService.userId
    console.log(userId);
    
    this.messageService.postMessage(content, userId)
  }

}
