import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './service/users.service';
​
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
​
  constructor(private user: UsersService,) { }
​
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const authToken = this.user.authToken;
    const newRequest = req.clone({
      withCredentials: false,
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    
    return next.handle(newRequest);
   
    
    
  }
​
}