// **** Types **** //

// User schema
export interface IUser {
  id: number;
  name: string;
  email: string;
}


// **** Functions **** //

/**
 * Get a new User object.
 */
function _new(name: string, email: string): IUser {
  return {
    id: -1,
    email,
    name,
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
  };
}


// **** Export default **** //

export default {
  new: _new,
  copy,
};
