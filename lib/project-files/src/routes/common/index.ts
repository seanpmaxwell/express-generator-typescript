import { Response, Request } from 'express';
import { isObject } from 'jet-validators';
import { parseObject, TSchema } from 'jet-validators/utils';

import { ValidationErr } from '@src/common/route-errors';


/******************************************************************************
                                Types
******************************************************************************/

type TRecord = Record<string, unknown>;
export type IReq = Request<TRecord, void, TRecord, TRecord>;
export type IRes = Response<unknown, TRecord>;


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Parse a Request object property and throw a Validation error if it fails.
 */
export function parseReq<U extends TSchema>(schema: U) {
  const parseFn = parseObject<U>(schema, _parseReqOnError);
  return (arg: unknown) => {
    if (isObject(arg)) {
      arg = { ...arg };
    }
    return parseFn(arg);
  };
}

/**
 * Error handler for the request parse function above.
 */
function _parseReqOnError(
  prop = 'undefined',
  value?: unknown,
  caughtErr?: unknown,
): void {
  if (caughtErr !== undefined) {
    const moreInfo = JSON.stringify(caughtErr);
    throw new ValidationErr(prop, value, moreInfo);
  } else {
    throw new ValidationErr(prop, value);
  }
}
