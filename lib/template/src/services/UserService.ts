import { NotFoundError } from '@src/common/classes/route-errors';
import User, { type UserEntity, type UserInput } from '@src/entities/User';
import UserRepo from '@src/repos/UserRepo';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const UserServiceErrors = {
  USER_NOT_FOUND: 'User not found',
} as const;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Get all users.
 */
function getAll(): Promise<UserEntity[]> {
  return UserRepo.getAll();
}

/**
 * Create a user from client input; the id and created date are set here.
 */
async function addOne(input: UserInput): Promise<UserEntity> {
  const user = User.create(input);
  await UserRepo.addOne(user);
  return user;
}

/**
 * Update one user.
 */
async function updateOne(user: UserEntity): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) throw new NotFoundError(UserServiceErrors.USER_NOT_FOUND);
  return UserRepo.updateOne(user);
}

/**
 * Delete a user by their id.
 */
async function deleteOne(id: string): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) throw new NotFoundError(UserServiceErrors.USER_NOT_FOUND);
  return UserRepo.deleteOne(id);
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  Errors: UserServiceErrors,
  getAll,
  addOne,
  updateOne,
  deleteOne,
} as const;
