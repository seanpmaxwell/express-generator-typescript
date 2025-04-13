import { Response, Request } from 'express';


/******************************************************************************
                                Types
******************************************************************************/

type TRecord = Record<string, unknown>;
export type IReq = Request<TRecord, void, TRecord, TRecord>;
export type IRes = Response<unknown, TRecord>;

