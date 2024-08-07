/* eslint-disable max-len */
/**
 * Shared types for routes.
 */

import { Response, Request } from 'express';


// **** Express **** //

type TPathParams = Record<string, string>;

export interface IReq<T = void> extends Request<TPathParams, void, T, TPathParams> {
  body: T;
}

export interface IRes extends Response {
  locals: Record<string, unknown>;
}

