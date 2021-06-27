import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/service/users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  fullPathname ='assets/images/logoModif.png';

  constructor(private formBuilder: FormBuilder,
              private UserService: UsersService,
              private router: Router) {}
 

  ngOnInit(): void {
    //formulaire reactive
    this.signupForm = this.formBuilder.group({
      //controle des champs requis avec un minimum de caractères
      firstName: this.formBuilder.control('',[Validators.required, Validators.minLength(2)]),
      lastName: this.formBuilder.control('',[Validators.required, Validators.minLength(2)]),
      password: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(5)]),
      dateBirth: this.formBuilder.control(''),
      picture: this.formBuilder.control(''),
    })
  }
  onRegister(): void{
    const formRegister = {
      //recupération des valeur des champs du formulaire 
      firstName: this.signupForm.get('firstName').value,
      lastName: this.signupForm.get('lastName').value,
      password: this.signupForm.get('password').value,
      email: this.signupForm.get('email').value,
    }
    //abonnementn au service et recupération de la reponse du backend 
    this.UserService.createUser(formRegister).subscribe(result => 
      {
        //ajout de la reponse au session storage 
        sessionStorage[`session`] = JSON.stringify(result);
        this.router.navigate['/home'];
      })

  }
  
}
