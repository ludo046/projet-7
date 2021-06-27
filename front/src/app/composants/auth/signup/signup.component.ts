import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginForm: FormGroup;
  public token: any;
  public result: any;
  sessionToken: String
  

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private UserService: UsersService) { }

  ngOnInit(): void {
    //reactive form
    this.loginForm = this.formBuilder.group({
      //controle des champ du formulaire 
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onLogin() {
    const formLogin = {
      //recupération des valeurs des champs 
        email:  this.loginForm.get('email').value,
        password: this.loginForm.get('password').value        
    };
    
    //abonnement au service et recuperation de la reponse du backend 
    //ajout de la reponse au session storage 
    this.UserService.logUser(formLogin).subscribe(result => sessionStorage[`session`] = JSON.stringify(result));
    //renvoie vers la page home 
    this.UserService.logUser(formLogin).subscribe(() => this.router.navigate(['home']));
    

  }

}
