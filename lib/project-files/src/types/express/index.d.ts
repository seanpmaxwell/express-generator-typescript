import 'express';

import { ISessionUser } from '@routes/middleware';



// **** Declaration Merging **** //

declare module 'express' {

  export interface Request {
    signedCookies: Record<string, string>;
  }

  export interface Response {
    locals: {
      sessionUser: ISessionUser;
    };
  }
}
