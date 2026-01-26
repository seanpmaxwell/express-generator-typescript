import { isNonEmptyString, isString, isUnsignedInteger } from 'jet-validators';
import { parseObject, Schema, testObject } from 'jet-validators/utils';

import { transformIsDate } from '@src/common/utils/validators';

import { Entity } from './common/types';

/******************************************************************************
                                 Constants
******************************************************************************/

const GetDefaults = (): User => ({
  id: 0,
  name: '',
  email: '',
  created: new Date(),
});

const schema: Schema<User> = {
  id: isUnsignedInteger,
  name: isString,
  email: isString,
  created: transformIsDate,
};

/******************************************************************************
                                  Types
******************************************************************************/

/**
 * @entity users
 */
export type User = Entity & {
  name: string;
  email: string;
};

/******************************************************************************
                                  Setup
******************************************************************************/

// Set the "parseUser" function
const parseUser = parseObject<User>(schema);

// For the APIs make sure the right fields are complete
const isCompleteUser = testObject<User>({
  ...schema,
  name: isNonEmptyString,
  email: isNonEmptyString,
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function newUser(user?: Partial<User>): User {
  return parseUser({ ...GetDefaults(), ...user }, (errors) => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: newUser,
  isComplete: isCompleteUser,
} as const;
