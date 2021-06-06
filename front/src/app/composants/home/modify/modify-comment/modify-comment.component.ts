import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/service/comment.service';

@Component({
  selector: 'app-modify-comment',
  templateUrl: './modify-comment.component.html',
  styleUrls: ['./modify-comment.component.scss']
})
export class ModifyCommentComponent implements OnInit {

  modifyComment: FormGroup;
  file: File;

  constructor(private formBuilder: FormBuilder,
              private commentService: CommentService) { }

  ngOnInit(): void {
    this.modifyComment = this.formBuilder.group({
      content: this.formBuilder.control('',(Validators.required)),
      attachment:this.formBuilder.control('')
    });
  }
  updateComment(){
    const content = this.modifyComment.get('content').value;
    const commentId = window.location.href.split('comment/')[1]
    const attachment = this.file
    console.log(commentId);
    
    console.log(content);
    
    
    this.commentService.updateComment(commentId, content, attachment).subscribe()
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }
}
