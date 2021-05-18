import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.scss']
})
export class DeletePostComponent implements OnInit {

  userId: string;

  constructor() { }

  ngOnInit(): void {
    this.userId = JSON.parse(sessionStorage.getItem('session')).userId;
  }

}
