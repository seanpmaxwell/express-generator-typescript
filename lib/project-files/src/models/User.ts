import { isString } from 'jet-validators';
import { parseObject, TParseOnError } from 'jet-validators/utils';

import { isRelationalKey, transIsDate } from '@src/util/validators';


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

// Initialize the parse function
const parseUser = parseObject<IUser>({
  id: isRelationalKey,
  name: isString,
  email: isString,
  created: transIsDate,
});


/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function newUser(user?: Partial<IUser>): IUser {
  const retVal = { ...DEFAULT_USER_VALS(), ...user };
  return parseUser(retVal, errors => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

/**
 * Check is a user object. For the route validation.
 */
function testUser(arg: unknown, errCb?: TParseOnError): arg is IUser {
  return !!parseUser(arg, errCb);
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: newUser,
  test: testUser,
} as const;