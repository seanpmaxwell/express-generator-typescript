import { Request, Response } from 'express';

/******************************************************************************
                                Types
******************************************************************************/

export type Req = Request<Record<string, string>, void, Record<string, string>>;
export type Res = Response;
