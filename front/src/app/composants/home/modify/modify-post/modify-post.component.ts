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
  file: File;
  public onePost:[];

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.getOnePost();
    this.modifyPost = this.formBuilder.group({
      content: this.formBuilder.control('',(Validators.required)),
      attachment:this.formBuilder.control('')
    });
  }


  updatePost(){
    const content = this.modifyPost.get('content').value;
    const messageId = window.location.href.split('post/')[1];
    const attachment = this.file;
    console.log(messageId);
    
    console.log(content);
    console.log(attachment);
    
    
    
    this.messageService.updatePost(messageId, content, attachment).subscribe()
  }

  getOnePost(){
    const messageId = window.location.href.split('post/')[1];
    this.messageService.getOnePost(messageId).subscribe(singlePost => {
      this.onePost = singlePost;
      console.log(this.onePost);
      
    })
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

}


