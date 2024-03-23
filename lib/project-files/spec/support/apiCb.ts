import { CallbackHandler } from 'supertest';
import moment from 'moment';
import logger from 'jet-logger';

import { TApiCb, TRes } from 'spec/types/misc';


/**
 * API callback function.
 */
function apiCb(
  cb: TApiCb,
  dateParam = 'created',
  printErr?: boolean,
): CallbackHandler {
  return (err: Error, res: TRes) => {
    if (printErr) {
      logger.err(err);
    }
    _strToDate(res.body, dateParam);
    return cb(res);
  };
}

/**
 * When date objects get sent through supertest they are converted to 
 * iso-strings. This will cause "toEqual()"" tests to fail, so we need to 
 * convert them back to Date objects.
 */
function _strToDate(
  param: unknown,
  prop: string,
): void {
  return _iterate(param, prop);
}

/**
 * Interate object recursively and convert string-dates to "Date" objects.
 */
function _iterate(param: unknown, prop: string): void {
  if (!param || typeof param !== 'object') {
    return;
  }
  const paramF = param as Record<string, unknown>;
  // For Arrays
  if (Array.isArray(paramF)) {
    for (const item of paramF) {
      _iterate(item, prop);
    }
    return;
  }
  // Check valid string or Date object. If undefined just skip
  const val = paramF[prop];
  if (
    (typeof val !== 'undefined') && 
    !((typeof val === 'string') || (val instanceof Date)) && 
    !moment(val as string | Date).isValid()
  ) {
    throw new Error('Property must be a valid date-string or Date() object');
  }
  // Convert and iterate
  if (typeof val !== 'undefined') {
    paramF[prop] = new Date(val as string | Date);
  }
  for (const key in paramF) {
    const oval = paramF[key];
    if (typeof oval === 'object' && key !== prop) {
      _iterate(oval, prop);
    }
  }
}


// **** Export default **** //

export default apiCb;
