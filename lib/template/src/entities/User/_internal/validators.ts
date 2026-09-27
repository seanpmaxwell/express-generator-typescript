import jetid from 'jet-id';
import { isNonEmptyString, isString } from 'jet-validators';
import { parseObject, type Schema, testObject } from 'jet-validators/utils';

import { isISOString } from '@src/common/utils/date-utils';

import type { UserEntity, UserInput } from '../types';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

const schema: Schema<UserEntity> = {
  id: isUserId,
  name: isString,
  email: isString,
  created: isISOString,
};

/**
 * Validate the `User` schema.
 */
export const parseUser = parseObject<UserEntity>(schema);

/**
 * For the APIs make sure the right fields are complete
 */
export const isCompleteUser = testObject<UserEntity>({
  ...schema,
  name: isNonEmptyString,
  email: isNonEmptyString,
});

/**
 * Validate the fields a client sends to create a user.
 */
export const isUserInput = testObject<UserInput>({
  name: isNonEmptyString,
  email: isNonEmptyString,
});

/**
 * Test if an id is a valid user id.
 */
export function isUserId(val: unknown): val is string {
  return jetid.test(val);
}
