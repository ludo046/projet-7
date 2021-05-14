import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-write-message',
  templateUrl: './write-message.component.html',
  styleUrls: ['./write-message.component.scss']
})
export class WriteMessageComponent implements OnInit {
  fullPathname='assets/images/icon.png'

  postMessage: FormGroup;
  formData = new FormData();
  attachment : File;
  file: File;
  @Output() newPost = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.postMessage = this.formBuilder.group({
      postOneMessage: this.formBuilder.control('',(Validators.required)),
      attachment:this.formBuilder.control('')
    });
    
  }

  writePost():void{
    const content = this.postMessage.get('postOneMessage').value;
    const attachment = this.file;
    console.log(this.file);
    
    //const session = JSON.parse(sessionStorage.getItem('session')).token;
    console.log(content);
    console.log(attachment);
    //console.log(session);
    
    this.messageService.writePost(content,attachment).subscribe(() => this.newPost.emit(true))
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    console.log(this.file);
  }

}
