import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public oneUserProfil: any;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  this.getUserProfile();
  }
  getUserProfile(): void{
     this.usersService.getUserProfile().subscribe(userProfile => {
      this.oneUserProfil = userProfile
      console.log(this.oneUserProfil);
      
    });
  }

  deleteUser(){
    this.usersService.deleteUser().subscribe()
    sessionStorage.removeItem('session')
  }

}
