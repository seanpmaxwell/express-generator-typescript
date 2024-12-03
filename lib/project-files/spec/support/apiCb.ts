import { CallbackHandler } from 'supertest';
import dayjs, { Dayjs } from 'dayjs';
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
  if (val !== undefined && !_isValidDate(val)) {
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

/**
 * Is date a valid date.
 */
function _isValidDate(date: unknown): boolean {
  if (
    typeof date === 'string' || 
    (date instanceof Date) || 
    (date instanceof Dayjs) || 
    typeof date === 'number'
  ) {
    return dayjs(date).isValid();
  } else {
    return false;
  }
}


// **** Export default **** //

export default apiCb;
