import { Request, Response } from 'express';
import { PlainObject } from 'jet-validators';

/******************************************************************************
                                Types
******************************************************************************/

export type Req = Request<PlainObject, void, PlainObject, PlainObject>;
export type Res = Response<unknown, PlainObject>;
