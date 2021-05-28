import { Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.scss']
})
export class ModifyPostComponent implements OnInit {

  modifyPost: FormGroup;
  @Input() postId: number;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.modifyPost = this.formBuilder.group({
      content: this.formBuilder.control('',(Validators.required)),
      //attachment:this.formBuilder.control('')
    });
  }

  updatePost(){
    const content = this.modifyPost.get('content').value;
    const messageId = window.location.href.split('post/')[1]
    console.log(messageId);
    
    console.log(content);
    
    
    this.messageService.updatePost(messageId, content).subscribe()
  }

}


