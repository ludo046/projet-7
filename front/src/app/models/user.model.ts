export class User{

    constructor(
        public firstname: String,
        public lastname: String,
        public password: String,
        public email: String,
        public dateBirth: String,
        public picture: String,
    ){

    }
}

export interface CreateUserRequest {
    firstName:  string;
    lastName: string;
    password: string;
    email: string;
    dateBirth: string;
    picture: string;
}