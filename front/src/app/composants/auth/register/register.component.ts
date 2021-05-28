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
    this.signupForm = this.formBuilder.group({
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
      firstName: this.signupForm.get('firstName').value,
      lastName: this.signupForm.get('lastName').value,
      password: this.signupForm.get('password').value,
      email: this.signupForm.get('email').value,
    }
    this.UserService.createUser(formRegister).subscribe(result => 
      {
        sessionStorage[`session`] = JSON.stringify(result);
        this.router.navigate['/home'];
      })

  }
  
}
