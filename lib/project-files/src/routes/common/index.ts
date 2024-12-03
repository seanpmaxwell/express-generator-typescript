import { Response, Request } from 'express';

import { parseObj, TSchema } from '@src/util/validators';
import { ValidationErr } from '@src/common/route-errors';


// **** Types **** //

type TObj = Record<string, unknown>;
export type IReq = Request<TObj, void, TObj, TObj>;
export type IRes = Response<unknown, TObj>;


// **** Functions **** //

/**
 * Parse a Request object property and throw a Validation error if it fails.
 */
export function reqParse<U extends TSchema>(schema: U) {
  return parseObj<U>(schema, reqParseOnError);
}

/**
 * Error handler for the request parse function above.
 */
function reqParseOnError(
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
