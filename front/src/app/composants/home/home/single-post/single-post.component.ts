import { Component, Input, EventEmitter, Output, } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import { UsersService } from 'src/app/service/users.service';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/service/comment.service';


@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent {

 @Input() allPost: any;
 public userId: any;
 connectUserId: number = JSON.parse(sessionStorage.getItem('session')).userId;
 oneUserProfil: any;
 faComment = faChevronRight;
 postComment: FormGroup;
 file: File;
 public comments: [];
 isAdmin: Boolean = JSON.parse(sessionStorage.getItem('session')).isAdmin;



  constructor(private messageService: MessageService,
              private usersService: UsersService,
              private formBuilder: FormBuilder,
              private commentService: CommentService) { }

  ngOnInit(): void {  
    this.newPost();
    this.newcomment();
    this.getUserProfile();
    this.postComment = this.formBuilder.group({
      postOneComment: this.formBuilder.control('',(Validators.required)),
      //attachment:this.formBuilder.control('')
    });
  }
  
  newPost():void{
    this.messageService.getPost().subscribe(posts => {
      this.userId = posts
    });
  }
  newcomment():void{
    this.commentService.getComment().subscribe(comments => {
      this.comments = comments
      console.log(this.comments);
    });
  }
  getUserProfile(): void{
    this.usersService.getUserProfile().subscribe(userProfile => {
     this.oneUserProfil = userProfile
     console.log(this.oneUserProfil);
   });
  }

  writeComment(postId: number):void{
    const content = this.postComment.get('postOneComment').value;
    // const attachment = this.file;
    // console.log(this.file);
    console.log(content);
    //console.log(attachment);
    
    this.commentService.writeComment(content,postId).subscribe(() => this.newcomment());
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    console.log(this.file);
  }
}
