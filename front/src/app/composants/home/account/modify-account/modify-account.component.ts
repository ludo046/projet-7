import { Component, OnInit } from '@angular/core';
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

  constructor(private formBuilder: FormBuilder,
              private userService: UsersService) { }

  ngOnInit(): void {
    this.updateAccountForm = this.formBuilder.group({
      firstName: this.formBuilder.control('',[Validators.minLength(2)]),
      lastName: this.formBuilder.control('',[Validators.minLength(2)]),
      email: this.formBuilder.control('', [Validators.email, Validators.minLength(5)]),
      dateBirth: this.formBuilder.control(''),
      picture: this.formBuilder.control(''),
    });
  }

  updateUserProfile(){
    //const formUpdateProfile = {
      const firstname = this.updateAccountForm.get('firstName').value;
      const lastname = this.updateAccountForm.get('lastName').value;
      const email = this.updateAccountForm.get('email').value;
      const datebirth = this.updateAccountForm.get('dateBirth').value;
    //};
    const picture = this.file;
    console.log(picture);
    

    //console.log(formUpdateProfile);
    console.log(picture);
    console.log(firstname);
    console.log(lastname);
    console.log(email);
    console.log(datebirth);
    
    this.userService.updateUserProfile(firstname,lastname,email,datebirth,picture).subscribe()
  }
  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

}
