import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.scss']
})
export class DeletePostComponent implements OnInit {

  @Input() postId:number;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }
  deletePost(){
    this.messageService.deletePost(this.postId).subscribe()
  }

}
