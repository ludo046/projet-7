import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronRight, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'src/app/service/message.service';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-write-message',
  templateUrl: './write-message.component.html',
  styleUrls: ['./write-message.component.scss']
})
export class WriteMessageComponent implements OnInit {
  //fullPathname='assets/images/icon.png'
  fullPathname = 'assets/images/userPicture.png'
  public faComment = faChevronRight;
  public faPaperClip = faPaperclip;

  public postMessage: FormGroup;
  public formData = new FormData();
  public attachment : File;
  public file: File;
  public movie: File;
  @Output() newPost = new EventEmitter<boolean>();
  public oneUserProfil: [];

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private usersService: UsersService) { }

  ngOnInit(): void {
    // controle du formulaire 
    this.postMessage = this.formBuilder.group({
      postOneMessage: this.formBuilder.control('',(Validators.required)),
      attachment:this.formBuilder.control('',(Validators.required)),
    });
    //appel de la fonction a l'initialisation du composant 
    this.getUserProfile();
  }

  writePost():void{
    //recuperation des valeur du formulaire
    const content = this.postMessage.get('postOneMessage').value;
    const attachment = this.file;
     
    //abonnement au service et rappel et creation d'un evenement a chaque fois que la fonction est activée
    this.messageService.writePost(content,attachment).subscribe(() => this.newPost.emit(true))
  }

  onFileAdded(event: Event) {
    //recuperation de la photo ou de la video ci il ya
    this.file = (event.target as HTMLInputElement).files[0];
  }
  getUserProfile(): void{
    this.usersService.getUserProfile().subscribe(userProfile => {
     this.oneUserProfil = userProfile     
   });
 }

}
