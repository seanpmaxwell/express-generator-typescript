import { Response, Request } from 'express';

import {
  ParseObjectError,
  TParseErrorItem,
  TSchema,
  parseObjectPlus,
} from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/route-errors';


/******************************************************************************
                                Types
******************************************************************************/

type TRecord = Record<string, unknown>;
export type IReq = Request<TRecord, void, TRecord, TRecord>;
export type IRes = Response<unknown, TRecord>;

export interface IParseRequestError {
  message: 'Parse request validation failed';
  errors: TParseErrorItem[];
}


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Parse an incoming route request object.
 */
export function parseReq<U extends TSchema>(schema: U) {
  const parse = parseObjectPlus(schema);
  return (arg: unknown) => {
    let retVal;
    try {
      retVal = parse(arg);
    } catch (err) {
      if (err instanceof ParseObjectError) {
        const errObj: IParseRequestError = {
          message: 'Parse request validation failed',
          errors: err.getErrors(),
        };
        const msg = JSON.stringify(errObj);
        throw new RouteError(HttpStatusCodes.BAD_REQUEST, msg);
      }
      throw err;
    }
    return retVal;
  };
}
