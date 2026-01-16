import { isDate } from 'jet-validators';
import { transform } from 'jet-validators/utils';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Convert to date object then check is a validate date.
 */
export const transformIsDate = transform(
  (arg) => new Date(arg as string),
  (arg) => isDate(arg),
);
