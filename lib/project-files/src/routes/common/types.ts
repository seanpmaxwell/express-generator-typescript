/* eslint-disable max-len */
/**
 * Shared types for routes.
 */

import { Response, Request } from 'express';


// **** Express Request **** //

type TPathParams = Record<string, string>;

interface QryObj {
  [key: string]: string | string[] | undefined;
}

type TQueryParams<U = void> =
   U extends void 
    ? QryObj 
    : U extends QryObj 
      ? U
      : never;


export interface IReq<T = void, U extends QryObj | void = void> extends Request<TPathParams, void, T, TQueryParams<U>> {
  body: T;
}


export interface IRes extends Response {
  locals: Record<string, unknown>;
}

