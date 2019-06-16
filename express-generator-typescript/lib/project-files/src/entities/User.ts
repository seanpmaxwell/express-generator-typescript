
export interface IUser {
    name: string;
    email: string;
}


export class User implements IUser {

    public name: string;
    public email: string;

    constructor(nameOrUser: string | IUser, email?: string) {
        if (typeof nameOrUser === 'string') {
            this.name = nameOrUser;
            this.email = email || '';
        } else {
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
        }
    }
}
