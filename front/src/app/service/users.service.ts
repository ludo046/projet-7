import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

Injectable({
    providedIn: 'root'
})

export class UsersService {
    users: User[] = []
    usersSub = new Subject<User[]>()

    constructor() {}

    emitUsers():void{
        this.usersSub.next(this.users)
    }
    addUsers(user: User):void{
        this.users.push(user);
    }
}