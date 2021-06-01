import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling'

import { AppComponent } from './app.component';
import { RegisterComponent } from './composants/auth/register/register.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { HeaderComponent } from './composants/header/header.component';
import { FooterComponent } from './composants/footer/footer.component';
import { HomeComponent } from './composants/home/home.component';
import { NavComponent } from './composants/home/nav/nav.component';
import { SinglePostComponent } from './composants/home/single-post/single-post.component';
import { AccountComponent } from './composants/home/account/account.component';
import { MessageComponent } from './composants/home/message/message.component';
import { SingleMessageComponent } from './composants/home/message/single-message/single-message.component';
import { UsersService } from './service/users.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WriteMessageComponent } from './composants/home/single-post/write-message/write-message.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LikeComponent } from './composants/home/single-post/like/like.component';
import { SignupComponent } from './composants/auth/signup/signup.component';
import { AuthInterceptor } from './auth-interceptor';
import { MessageService } from './service/message.service';
import { DeletePostComponent } from './composants/home/delete-post/delete-post.component';
import { ModifyPostComponent } from './composants/home/modify-post/modify-post.component';
import { ModifyAccountComponent } from './composants/home/account/modify-account/modify-account.component';
import { LikeCommentsComponent } from './composants/home/single-post/like-comments/like-comments.component';



export const ROUTES : Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: 'message', component: MessageComponent },
  { path: 'modify-account', component: ModifyAccountComponent },
  { path: 'modify-post/:postId', component: ModifyPostComponent },
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
    WriteMessageComponent,
    LikeComponent,
    DeletePostComponent,
    ModifyPostComponent,
    ModifyAccountComponent,
    LikeCommentsComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ScrollingModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, UsersService, MessageService, FormBuilder, HttpClientModule, HttpClient, FooterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
