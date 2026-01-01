import { isString, isUnsignedInteger } from 'jet-validators';
import { parseObject, OnErrorCallback } from 'jet-validators/utils';

import { transformIsDate } from '@src/common/util/validators';
import { IModel } from './common/types';

/******************************************************************************
                                 Constants
******************************************************************************/

const DEFAULT_USER_VALS: IUser = {
  id: 0,
  name: '',
  created: new Date(),
  email: '',
} as const;

/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser extends IModel {
  name: string;
  email: string;
}

/******************************************************************************
                                  Setup
******************************************************************************/

// Initialize the "parseUser" function
const parseUser = parseObject<IUser>({
  id: isUnsignedInteger,
  name: isString,
  email: isString,
  created: transformIsDate,
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function __new__(user?: Partial<IUser>): IUser {
  const defaults = { ...DEFAULT_USER_VALS };
  defaults.created = new Date();
  return parseUser({ ...defaults, ...user }, errors => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

/**
 * Check is a user object. For the route validation.
 */

// because this isn't marked with the symbol, the errors are not bubbling up
function test(arg: unknown, errCb?: OnErrorCallback): arg is IUser {
  return !!parseUser(arg, errCb);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: __new__,
  test,
} as const;