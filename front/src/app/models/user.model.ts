export class User{

    constructor(
        public firstname: String,
        public lastname: String,
        public password: String,
        public email: String,
    ){

    }
}

export interface CreateUserRequest {
    firstName:  String;
    lastName: String;
    password: String;
    email: String;
}

export interface LoginUser {
    email: String;
    password: String;
}

export interface UpdateUser {
    firstname:  string;
    lastname: string;
    email: string;
    datebirth: string;
}