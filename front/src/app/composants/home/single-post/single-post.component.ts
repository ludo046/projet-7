import { Component, Input } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import { UsersService } from 'src/app/service/users.service';
import { faChevronRight, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/service/comment.service';


@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent {
  
 fullPathname = 'assets/images/userPicture.png'
 @Input() allPost: any;
 public userId: any;
 public connectUserId: number = JSON.parse(sessionStorage.getItem('session')).userId;
 public oneUserProfil: any;
 public faComment = faChevronRight;
 public faPaperClip = faPaperclip;
 public postComment: FormGroup;
 public fileComment: File;
 public comments: [];
 public isAdmin: Boolean = JSON.parse(sessionStorage.getItem('session')).isAdmin;


  constructor(private messageService: MessageService,
              private usersService: UsersService,
              private formBuilder: FormBuilder,
              private commentService: CommentService) { }

  ngOnInit(): void {  
    this.newPost();
    this.getUserProfile();
    this.postComment = this.formBuilder.group({
      postOneComment: this.formBuilder.control('',(Validators.required)),
      attachmentComment:this.formBuilder.control('')
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
    const attachment = this.fileComment;
    console.log(content);
    console.log(attachment);
    
    
    this.commentService.writeComment(content,attachment,postId).subscribe(() => this.newcomment());
  }

  onFileCommentAdded(event: Event) {
    this.fileComment = (event.target as HTMLInputElement).files[0];
    console.log(this.fileComment);
  }
}
