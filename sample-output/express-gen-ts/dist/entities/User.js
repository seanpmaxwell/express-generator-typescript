"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(nameOrUser, email) {
        if (typeof nameOrUser === 'string') {
            this.name = nameOrUser;
            this.email = email || '';
        }
        else {
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
        }
    }
}
exports.User = User;
