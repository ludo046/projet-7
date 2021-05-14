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
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onLogin() {
    const formLogin = {
        email:  this.loginForm.get('email').value,
        password: this.loginForm.get('password').value        
    };
    console.log(formLogin);
    
    this.UserService.logUser(formLogin).subscribe(result => sessionStorage[`session`] = JSON.stringify(result))
    this.UserService.logUser(formLogin).subscribe(result => this.router.navigate(['home']))
    

  }

}
