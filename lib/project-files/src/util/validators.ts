import { isNumber, isDate } from 'jet-validators';
import { transform } from 'jet-validators/utils';


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Database relational key.
 */
export function isRelationalKey(arg: unknown): arg is number {
  return isNumber(arg) && arg >= -1;
}

/**
 * Convert to date object then check is a validate date.
 */
export const transIsDate = transform(
  arg => new Date(arg as string),
  arg => isDate(arg),
);
