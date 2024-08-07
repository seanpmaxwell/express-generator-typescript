// import * as e from 'express';
// import { Query } from 'express-serve-static-core';

// import { ISessionUser } from '@src/models/User';


// // **** Express **** //

// export interface IReq<T = void> extends e.Request {
//   body: T;
// }

// export interface IReqQuery<T extends Query, U = void> extends e.Request {
//   query: T;
//   body: U;
// }

// export interface IRes extends e.Response {
//   locals: {
//     sessionUser: ISessionUser;
//   };
// }


/* eslint-disable max-len */
/**
 * Shared types for routes.
 */

import { Response, Request } from 'express';
import { ISessionUser } from '@src/models/User';


// **** Express **** //

type TPathParams = Record<string, string>;

export interface IReq<T = void> extends Request<TPathParams, void, T, TPathParams> {
  body: T;
}

interface ILocals {
  sessionUser: ISessionUser;
}

// I know since its a type I should use 'TRes' instead of 'IRes' but I'm
// leaving it as this cause it looks better alongside 'IReq'
export type IRes = Response<unknown, ILocals>;

