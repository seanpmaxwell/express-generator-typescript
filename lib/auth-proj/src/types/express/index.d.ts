import { IUser } from '@models/user-model';
import { ISessionUser } from '@routes/middleware';


declare module 'express' {

  export interface Request  {
    signedCookies: Record<string, string>,
    body: {
      user?: IUser
      email?: string;
      password?: string;
      message?: string;
      socketId?: string;
    };
  }

  export interface Response {
    locals: {
      sessionUser: ISessionUser;
    };
  }
}
