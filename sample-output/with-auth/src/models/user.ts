
export enum UserRoles {
    Standard,
    Admin,
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    pwdHash: string;
    role: UserRoles;
}


/**
 * Get a new User object.
 * 
 * @param name 
 * @param email 
 * @param role 
 * @param pwdHash 
 * @returns 
 */
function getNew(
    name: string,
    email: string,
    role?: UserRoles,
    pwdHash?: string,
): IUser {
    return {
        id: -1,
        email,
        name,
        role: role ?? UserRoles.Standard,
        pwdHash: pwdHash ?? '',
    };
}


/**
 * Copy a user object.
 * 
 * @param user 
 * @returns 
 */
function copy(user: IUser): IUser {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        pwdHash: user.pwdHash,
    }
}


// Export default
export default {
    new: getNew,
    copy,
}
