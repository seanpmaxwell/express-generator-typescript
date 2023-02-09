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

  constructor(
    nameOrObj: string | object,
    email?: string,
    role?: UserRoles,
    pwdHash?: string,
    id?: number,
  ) {
    if (typeof nameOrObj === 'string') {
      this.name = nameOrObj;
      this.email = (email ?? '');
      this.role = (role ?? UserRoles.Standard);
      this.pwdHash = (pwdHash ?? '');
      this.id = (id ?? -1);
    } else if (User.IsUserObj(nameOrObj)) {
      const o = nameOrObj as IUser;
      this.name = o.name;
      this.email = (o.email ?? '');
      this.role = (o.role ?? UserRoles.Standard);
      this.pwdHash = (o.pwdHash ?? '');
      this.id = (o.id ?? -1);
    } else {
      throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }
  }

  /**
   * Is this an object which contains all the user keys.
   */
  public static IsUserObj(this: void, arg: unknown): boolean {
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
