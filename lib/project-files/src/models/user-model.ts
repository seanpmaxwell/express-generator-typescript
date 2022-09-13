// **** Types **** //

export enum UserRoles {
  Standard,
  Admin,
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  pwdHash?: string;
  role?: UserRoles;
}


// **** Functions **** //

/**
 * Get a new User object.
 */
function _new(
  name: string,
  email: string,
  role?: UserRoles,
  pwdHash?: string,
): IUser {
  return {
    id: -1,
    email,
    name,
    role: (role ?? UserRoles.Standard),
    pwdHash: (pwdHash ?? ''),
  };
}

/**
 * Copy a user object.
 */
function copy(user: IUser): IUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    pwdHash: user.pwdHash,
  };
}

/**
 * See if an object is an instance of User.
 */
function instanceOfUser(arg: object): boolean {
  // pick up here tomorrow test that this works
  return (
    'id' in arg &&
    'email' in arg &&
    'name' in arg &&
    'role' in arg
  );
}


// **** Export default **** //

export default {
  new: _new,
  copy,
  instanceOfUser,
};