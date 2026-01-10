import { Response, Request } from 'express';
import { PlainObject } from 'jet-validators';

/******************************************************************************
                                Types
******************************************************************************/

export type IReq = Request<PlainObject, void, PlainObject, PlainObject>;
export type IRes = Response<unknown, PlainObject>;

