import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/service/message.service';
import { UsersService } from 'src/app/service/users.service';

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
  oneUserProfil: [];

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private usersService: UsersService) { }

  ngOnInit(): void {
    this.postMessage = this.formBuilder.group({
      postOneMessage: this.formBuilder.control('',(Validators.required)),
      attachment:this.formBuilder.control('',)
    });
    this.getUserProfile();
  }

  writePost():void{
    const content = this.postMessage.get('postOneMessage').value;
    const attachment = this.file;  
     
    this.messageService.writePost(content,attachment).subscribe(() => this.newPost.emit(true))
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    console.log(this.file);
  }

  getUserProfile(): void{
    this.usersService.getUserProfile().subscribe(userProfile => {
     this.oneUserProfil = userProfile     
   });
 }

}
