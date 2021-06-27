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
  //appel de la fonction de recuperation du profil utilisateur a l'initialisation du composant 
  this.getUserProfile();
  }
  //fonction de recuperation du profil utilisateur 
  getUserProfile(): void{
    //abonnement au service et recuperation de la reponse du backend 
     this.usersService.getUserProfile().subscribe(userProfile => {
      this.oneUserProfil = userProfile
    });
  }
  //fonction de suppression d'un utilisateur 
  deleteUser(){
    //abonnement au service 
    this.usersService.deleteUser().subscribe()
    //suppression des imformation stocker dans le session storage 
    sessionStorage.removeItem('session')
  }

}
