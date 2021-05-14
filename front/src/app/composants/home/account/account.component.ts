import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  profile: any

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {

  }
  getUserProfile(){
    // //const headerAuth = JSON.parse(sessionStorage.getItem('session')).token
    // this.usersService.getUserProfile().subscribe(userProfile => {
    //   //console.log(userProfile);
      
    //});
  }

}
