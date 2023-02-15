// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';

export enum UserRoles {
  Standard,
  Admin,
}


// **** Types **** //

export interface IUser {
  id: number;
  name: string;
  email: string;
  pwdHash?: string;
  role?: UserRoles;
}

export interface ISessionUser {
  id: number;
  email: string;
  name: string;
  role: IUser['role'];
}


// **** User **** //

class User implements IUser {

  public id: number;
  public name: string;
  public email: string;
  public role?: UserRoles;
  public pwdHash?: string;

  /**
   * Constructor()
   */
  public constructor(
    name?: string,
    email?: string,
    role?: UserRoles,
    pwdHash?: string,
    id?: number, // id last cause usually set by db
  ) {
    this.name = (name ?? '');
    this.email = (email ?? '');
    this.role = (role ?? UserRoles.Standard);
    this.pwdHash = (pwdHash ?? '');
    this.id = (id ?? -1);
  }

  /**
   * Get user instance from object.
   */
  public static from(param: object): User {
    // Check is user
    if (!User.isUser(param)) {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }
    // Get user instance
    const p = param as IUser;
    return new User(p.name, p.email, p.role, p.pwdHash, p.id);
  }

  /**
   * Is this an object which contains all the user keys.
   */
  public static isUser(this: void, arg: unknown): boolean {
    return (
      !!arg &&
      typeof arg === 'object' &&
      'id' in arg &&
      'email' in arg &&
      'name' in arg &&
      'role' in arg
    );
  }
}


// **** Export default **** //

export default User;
