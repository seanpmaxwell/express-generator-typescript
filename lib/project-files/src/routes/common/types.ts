/* eslint-disable max-len */
/**
 * Shared types for routes.
 */

import { Response, Request } from 'express';


// **** Express **** //

type TObj = Record<string, unknown>;

export type IReq = Request<TObj, void, TObj, TObj>;

export type IRes = Response<unknown, TObj>

