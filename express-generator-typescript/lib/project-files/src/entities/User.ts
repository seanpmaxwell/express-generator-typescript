
interface IUser {
    name: string;
    email: string;
}

class User {

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

export default User;
