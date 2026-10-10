import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';

import {
  getISOString,
  type ISOString,
  ISOStringSchema,
} from '@src/common/utils/date.utils';

import type { UserEntity, UserInput } from './types';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

/** @ValueFactoryFunction */
const UserDefaults = () => ({
  id: genId(),
  name: '--',
  email: '--@example.com',
  created: getISOString(),
});

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const UserIdSchema = z.uuidv7('Not a valid uuid7 id');

const UserInputSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  email: z.email('Not a valid email'),
}) satisfies z.ZodType<UserInput>;

const UserSchema = UserInputSchema.extend({
  id: UserIdSchema,
  created: ISOStringSchema,
}) satisfies z.ZodType<UserEntity>;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Factory-function.
 *
 * Create a `UserEntity` from a partial or `undefined`
 */
function create(user?: Partial<UserEntity>): UserEntity {
  return { ...UserDefaults(), ...user };
}

/**
 * Factory-function.
 *
 * Create a `UserEntity` from individual properties
 */
function of(name: string, email?: string, created?: ISOString): UserEntity {
  const retVal = UserDefaults();
  if (name) retVal.name = name;
  if (email) retVal.email = email;
  if (created) retVal.created = created;
  return retVal;
}

/**
 * Generate a uuid7 id.
 */
function genId(): string {
  return uuidv7();
}

/**
 * Check if a valid user object
 */
function isUser(val: unknown): val is UserEntity {
  return UserSchema.safeParse(val).success;
}

/**
 * Check if a valid end users input fields are valid.
 */
function isUserInput(val: unknown): val is UserInput {
  return UserInputSchema.safeParse(val).success;
}

/**
 * Test if an id is a valid user id.
 */
function isUserId(val: unknown): val is string {
  return UserIdSchema.safeParse(val).success;
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  of,
  create,
  genId,
  is: {
    id: isUserId,
    user: isUser,
    input: isUserInput,
  },
  Schemas: {
    Main: UserSchema,
    Input: UserInputSchema,
    Id: UserIdSchema,
  },
} as const;
