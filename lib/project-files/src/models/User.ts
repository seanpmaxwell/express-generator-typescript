import { isString } from 'jet-validators';
import { parseObjectPlus, TParser } from 'jet-validators/utils';

import { isRelationalKey, tranIsDate } from '@src/util/validators';


/******************************************************************************
                                 Variables
******************************************************************************/

const DEFAULT_USER_VALS = (): IUser => ({
  id: -1,
  name: '',
  created: new Date(),
  email: '',
});


/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser {
  id: number;
  name: string;
  email: string;
  created: Date;
}


/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function newUser(user: Partial<IUser>): IUser {
  const retVal = { ...DEFAULT_USER_VALS(), ...user };
  return parseUser(retVal);
}

/**
 * Validate user object but return type predicate.
 */
function testIsUser(arg: unknown): arg is IUser {
  return !!parseUser(arg);
}

/**
 * Validate a user object.
 */
const parseUser: TParser<IUser> = parseObjectPlus({
  id: isRelationalKey,
  name: isString,
  email: isString,
  created: tranIsDate,
});


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: newUser,
  parse: parseUser,
  test: testIsUser,
} as const;