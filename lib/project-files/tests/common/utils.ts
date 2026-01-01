import { ParseError, parseJson } from 'jet-validators/utils';
import { isString } from 'jet-validators';
import { IUser } from '@src/models/User';

/******************************************************************************
                                Types
******************************************************************************/

type TUserArray = IUser[] | readonly IUser[];

interface IValidationError {
  message: string;
  errors: ParseError[];
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * JSON parse a validation error.
 */
export function parseValidationError(arg: unknown): IValidationError {
  if (!isString(arg)) {
    throw new Error('Not a string');
  }
  return parseJson<IValidationError>(arg);
}

/**
 * Compare to user arrays. Order does not matter and this assumes the email 
 * field is unique
 */
export function compareUserArrays(a: TUserArray, b: TUserArray): boolean {
  if (a.length !== b.length) return false;
  const aSorted = sortByEmail(a);
  const bSorted = sortByEmail(b);
  for (let i = 0; i < aSorted.length; i++) {
    const a = aSorted[i],
      b = bSorted[i];
    if (a.email !== b.email || a.name !== b.name) {
      return false;
    }
  }
  return true;
}

/**
 * Sort user array by email.
 */
function sortByEmail(arr: TUserArray): IUser[] {
  return [...arr].sort((x, y) => {
    return x.email.localeCompare(y.email);
  });
}
