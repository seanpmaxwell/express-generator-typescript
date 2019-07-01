
export interface IUser {
    id?: number;
    name: string;
    email: string;
}

export class User implements IUser {

    public id?: number;
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
