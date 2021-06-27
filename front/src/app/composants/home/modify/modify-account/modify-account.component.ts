import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-modify-account',
  templateUrl: './modify-account.component.html',
  styleUrls: ['./modify-account.component.scss']
})
export class ModifyAccountComponent implements OnInit {

public updateAccountForm: FormGroup;
public file: File;
@Output() newProfile = new EventEmitter<boolean>();
public oneUserProfil: [];

  constructor(private formBuilder: FormBuilder,
              private userService: UsersService) { }

  ngOnInit(): void {
    //appel de la fonction a l'initioalisation du composant 
    this.getUserProfile()
    //reactive form 
    this.updateAccountForm = this.formBuilder.group({
      //controle des champs du formulaire 
      firstName: this.formBuilder.control('',[Validators.minLength(2)]),
      lastName: this.formBuilder.control('',[Validators.minLength(2)]),
      email: this.formBuilder.control('', [Validators.email, Validators.minLength(5)]),
      dateBirth: this.formBuilder.control(''),
      picture: this.formBuilder.control(''),
    });
  }

  updateUserProfile(){
      //recuperation des valeursdu formulaire 
      const firstname = this.updateAccountForm.get('firstName').value;
      const lastname = this.updateAccountForm.get('lastName').value;
      const email = this.updateAccountForm.get('email').value;
      const datebirth = this.updateAccountForm.get('dateBirth').value;
      const picture = this.file;
    //abonnement au service et envoie des informations 
    this.userService.updateUserProfile(firstname,lastname,email,datebirth,picture).subscribe(() => this.newProfile.emit(true))
  }

  getUserProfile(): void{
    this.userService.getUserProfile().subscribe(userProfile => {
     this.oneUserProfil = userProfile
     console.log(this.oneUserProfil); 
   });
 }

  onFileAdded(event: Event) {
    //recuperation du fichier ci il ya 
    this.file = (event.target as HTMLInputElement).files[0];
  }

}
