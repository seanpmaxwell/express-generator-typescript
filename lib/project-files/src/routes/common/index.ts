import { Response, Request } from 'express';
import { isObject, isString } from 'jet-validators';
import { parseObject, TSchema } from 'jet-validators/utils';

import { ValidationErr } from '@src/common/route-errors';


/******************************************************************************
                                Types
******************************************************************************/

type TRecord = Record<string, unknown>;
export type IReq = Request<TRecord, void, TRecord, TRecord>;
export type IRes = Response<unknown, TRecord>;

export type TParseReqErr = {
  prop: string,
  value: unknown,
  moreInfo?: string,
} | string;


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Parse a Request object property and throw a Validation error if it fails.
 */
export function parseReq<U extends TSchema>(schema: U) {
  return (arg: unknown) => {
    // Don't alter original object (shallow copy is good enough)
    if (isObject(arg)) {
      arg = { ...arg };
    }
    // Setup error callback
    const errArr: TParseReqErr[] = [],
      errCb = setupErrorCb(errArr);
    // Run Tests
    const retVal = parseObject<U>(schema, errCb)(arg);
    if (errArr.length > 0) {
      throw new ValidationErr(errArr);
    }
    // Return
    return retVal;
  };
}

/**
 * Setup the error callback function for when "parseReq" fires and error.
 */
function setupErrorCb(errArr: TParseReqErr[]) {
  return function (
    prop = 'undefined',
    value?: unknown,
    caughtErr?: unknown,
  ) {
    // Initialize err
    let err: TParseReqErr;
    if (arguments.length === 1) {
      err = prop;
    } else {
      err = { prop, value };
    }
    // Check if there's a "caught error"
    if (isObject(err) && caughtErr !== undefined) {
      let moreInfo;
      if (!isString(caughtErr)) {
        moreInfo = JSON.stringify(caughtErr);
      } else {
        moreInfo = caughtErr;
      }
      err.moreInfo = moreInfo;
    }
    // Add error to array
    errArr.push(err);
  };
}
