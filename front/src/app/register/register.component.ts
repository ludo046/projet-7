import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UsersService } from 'src/app/service/users.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
              private userService: UsersService,
              private router: Router) {}
 

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: this.formBuilder.control('',[Validators.required, Validators.minLength(2)]),
      lastName: this.formBuilder.control('',[Validators.required, Validators.minLength(2)]),
      password: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(5)]),
      dateBirth: this.formBuilder.control('', (Validators.required)),
      picture: this.formBuilder.control('', (Validators.required)),
    })
  }

  onRegister():void{
    const dataUser = this.signupForm.value;
    const newUser = new User(
      dataUser.firstName,
      dataUser.lastName,
      dataUser.password,
      dataUser.email,
      dataUser.dateBirth,
      dataUser.picture
    )
    // console.log(newUser)
    
    
    // this.userService.createUser(newUser)
    //this.router.navigate(["/home"])




    const firstName = this.signupForm.get('firstname').value;
    const lastName = this.signupForm.get('lastname').value
    const password = this.signupForm.get('password').value;
    const email = this.signupForm.get('email').value;
    const dateBirth = this.signupForm.get('email').value;
    const picture = this.signupForm.get('picture').value;
    this.userService.createUser(newUser).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.userService.loginUser(email, password).then(
          () => {
            this.router.navigate(['/home']);
          }
        ).catch(
          (error) => {
            console.error(error);
            this.errorMsg = error.message;
          }
        );
      }
    ).catch((error) => {
        console.error(error);
        this.errorMsg = error.message;
    });
  }
  
}
