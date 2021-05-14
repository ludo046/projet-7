
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from './service/users.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UsersService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
    if (sessionStorage.getItem('session')) {
      return true;
    }
    else {
      return this.router.parseUrl('/signup');
    }
  }

}