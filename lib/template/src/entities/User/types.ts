import type { Entity } from '@src/entities/common/types';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

/**
 * @entity `users`
 */
export interface UserEntity extends Entity {
  name: string;
  email: string;
}

/**
 * Fields a client supplies when creating a user; the server sets the rest.
 */
export type UserInput = Pick<UserEntity, 'name' | 'email'>;
