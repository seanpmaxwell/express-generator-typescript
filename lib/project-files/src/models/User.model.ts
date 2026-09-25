import jetid from 'jet-id';
import { isNonEmptyString, isString, isUnsignedInteger } from 'jet-validators';
import { parseObject, Schema, testObject } from 'jet-validators/utils';

import { getISOString, isISOString } from '@src/common/utils/date-utils';

import { Entity } from './common/types';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const GetDefaults = (): IUser => ({
  id: jetid(),
  name: '',
  email: '',
  created: getISOString(),
});

const schema: Schema<IUser> = {
  id: isUserId,
  name: isString,
  email: isString,
  created: isISOString,
};

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

/**
 * @entity users
 */
export interface IUser extends Entity {
  name: string;
  email: string;
}

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Validate the `User` schema.
 */
const parseUser = parseObject<IUser>(schema);

/**
 * For the APIs make sure the right fields are complete
 */
const isCompleteUser = testObject<IUser>({
  ...schema,
  name: isNonEmptyString,
  email: isNonEmptyString,
});

/**
 * Test if an id is a valid user id.
 */
function isUserId(val: unknown): val is string {
  return jetid.test(val);
} 

/**
 * New user object.
 */
function new_(user?: Partial<IUser>): IUser {
  return parseUser({ ...GetDefaults(), ...user }, (errors) => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  new: new_,
  isId: isUserId,
  isComplete: isCompleteUser,
} as const;
