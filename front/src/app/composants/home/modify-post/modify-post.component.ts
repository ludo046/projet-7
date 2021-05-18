import { Component, OnInit, } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.scss']
})
export class ModifyPostComponent implements OnInit {

  public userId: string;
  public userPostId: any;
  

  constructor( public homeComponent: HomeComponent) { }

  ngOnInit(): void {
    this.userId = JSON.parse(sessionStorage.getItem('session')).userId;
    this.userPostId = this.homeComponent.allPost
    //console.log(this.userId);
    //console.log(this.userPostId);
    
    
  }

}
