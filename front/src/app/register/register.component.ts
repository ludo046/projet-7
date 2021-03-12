import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  constructor(private router: Router,) { }

  ngOnInit(): void {

  }

}
