import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const authToken = JSON.parse(sessionStorage.getItem('session')).token; 
    console.log(authToken);
    
    const newRequest = req.clone({
      withCredentials: false ,
      headers: req.headers.set('authorization', authToken) 
    });
    return next.handle(newRequest);
  }
}