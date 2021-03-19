import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home/home.component';
import { NavComponent } from './home/nav/nav.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { AccountComponent } from './home/account/account.component';
import { MessageComponent } from './home/message/message.component';
import { SingleMessageComponent } from './home/message/single-message/single-message.component';
import { UsersService } from './service/users.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { WriteMessageComponent } from './home/write-message/write-message.component';

export const ROUTES : Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: 'message', component: MessageComponent },
  { path: '', component: SignupComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NavComponent,
    SinglePostComponent,
    AccountComponent,
    MessageComponent,
    SingleMessageComponent,
    WriteMessageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [UsersService, FormBuilder, HttpClientModule, HttpClient, FooterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
