import jetid from 'jet-id';

import { getISOString, type ISOString } from '@src/common/utils/date-utils';

import {
  isCompleteUser,
  isUserId,
  isUserInput,
  parseUser,
} from './_internal/validators';
import type { UserEntity } from './types';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Get a new `UserEntity` object with default values.
 */
function getDefaults(): UserEntity {
  return {
    id: jetid(),
    name: '',
    email: '',
    created: getISOString(),
  };
}

/**
 * Factory-function.
 *
 * Create a `UserEntity` from a partial or `undefined`
 */
function create(user?: Partial<UserEntity>): UserEntity {
  return parseUser({ ...getDefaults(), ...user }, (errors) => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

/**
 * Factory-function.
 *
 * Create a `UserEntity` from individual properties
 */
function of(name: string, email?: string, created?: ISOString): UserEntity {
  const retVal = getDefaults();
  if (name) retVal.name = name;
  if (email) retVal.email = email;
  if (created) retVal.created = created;
  return retVal;
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  of,
  create,
  isId: isUserId,
  isComplete: isCompleteUser,
  isInput: isUserInput,
} as const;
