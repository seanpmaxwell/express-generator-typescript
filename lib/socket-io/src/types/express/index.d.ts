import 'express';
import * as e from 'express';
import { Query } from 'express-serve-static-core';

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


// **** Generics for Request Object **** //

export interface IReq<T> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body?: U;
}
