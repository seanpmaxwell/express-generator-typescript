import logger from 'jet-logger';

import { ParamInvalidError } from './errors';


// **** Param Types **** //

type TParam = string | number | boolean | null | object;
type TParamFull = TParam | ((arg: TParam) => boolean);


// **** Functions **** //

/**
 * Print an error object if it's truthy. Useful for testing.
 */
export function pErr(err?: Error): void {
  if (!!err) {
    logger.err(err);
  }
}

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Make sure parameter of the specified type. If the type if not provided then string is
 * used as the default type to check. Instead of a type you can also pass a validator function 
 * which must return 'true' or 'false'.
 * 
 * Example 1: validate(email, [user, 'object'], [isAdmin, 'boolean'])
 * Example 2: validate(password) // will check that password is a string
 * Example 3: validate([isAdmin, 'boolean'])
 * Example 4: validate([user, isInstanceOfUser])
 */
export function validate(...params: Array<TParam | TParamFull[]>): void {
  for (const param of params) {
    // If param is array check provided type
    if (param instanceof Array) {
      // Validator function provided
      if (typeof param[1] === 'function') {
        const fn = param[1];
        if (!fn(param[0])) {
          throw new Error(`Validator function ${fn.name} failed.`);
        }
      // If type if a number, need to do isNaN, cause type NaN is a 'number'. 
      // This could be an issue if you do Number(undefined)
      } else if (param[1] === 'number') {
        if (isNaN(param[0] as number)) {
          throw new ParamInvalidError();
        }
      } else if (typeof param[0] !== param[1]) {
        throw new ParamInvalidError();
      }
    // String is default if type is not provided
    } else {
      if (typeof param !== 'string') {
        throw new ParamInvalidError();
      }
    }
  } 
}
