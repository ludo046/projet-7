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
 @Input() allPost: [];
 public userId: [];
 public oneUserProfil: [];
 public faComment = faChevronRight;
 public faPaperClip = faPaperclip;
 public postComment: FormGroup;
 public fileComment: File;
 public comments: [];
 public connectUserId = JSON.parse(sessionStorage.getItem('session')).userId;
 public isAdmin = JSON.parse(sessionStorage.getItem('session')).isAdmin;


  constructor(private messageService: MessageService,
              private usersService: UsersService,
              private formBuilder: FormBuilder,
              private commentService: CommentService) { }

  ngOnInit(): void {  
    //appel des fonctions a l'initialisation du composant 
    this.newPost();
    this.getUserProfile();
    this.newcomment();
    //controle du formulaire 
    this.postComment = this.formBuilder.group({
      postOneComment: this.formBuilder.control('',(Validators.required)),
      attachmentComment:this.formBuilder.control('')
    });
  }

  newPost():void{
    //abonnement au service et recuperation de la reponse du backend 
    this.messageService.getPost().subscribe(posts => {
      this.userId = posts
    });
  }

  newcomment():void{
    this.commentService.getComment().subscribe(comments => {
      this.comments = comments
    });
  }

  getUserProfile(): void{
    this.usersService.getUserProfile().subscribe(userProfile => {
     this.oneUserProfil = userProfile
   });
  }

  writeComment(postId: number):void{
    //recuperation des valeur du formulaire
    const content = this.postComment.get('postOneComment').value;
    const attachment = this.fileComment;
    //abonnement au service et rappel de fonction 
    this.commentService.writeComment(content,attachment,postId).subscribe(() => this.newcomment());
  }

  onFileCommentAdded(event: Event) {
    //recuperation de l'image ou de la video ci il yen a une
    this.fileComment = (event.target as HTMLInputElement).files[0];
  }
}
