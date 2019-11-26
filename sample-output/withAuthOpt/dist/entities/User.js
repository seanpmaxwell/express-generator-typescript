"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserRoles;
(function (UserRoles) {
    UserRoles[UserRoles["Standard"] = 0] = "Standard";
    UserRoles[UserRoles["Admin"] = 1] = "Admin";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
class User {
    constructor(nameOrUser, email, role, pwdHash) {
        if (typeof nameOrUser === 'string' || typeof nameOrUser === 'undefined') {
            this.name = nameOrUser || '';
            this.email = email || '';
            this.role = role || UserRoles.Standard;
            this.pwdHash = pwdHash || '';
        }
        else {
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
            this.role = nameOrUser.role;
            this.pwdHash = nameOrUser.pwdHash;
        }
    }
}
exports.User = User;
