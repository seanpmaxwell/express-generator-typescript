import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import User, { IUser, IUserInput } from '@src/models/User.model';
import UserRepo from '@src/repos/UserRepo';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const Errors = {
  USER_NOT_FOUND: 'User not found',
} as const;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Create a user from client input; the id and created date are set here.
 */
async function addOne(input: IUserInput): Promise<IUser> {
  const user = User.new(input);
  await UserRepo.add(user);
  return user;
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function deleteOne(id: string): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.delete(id);
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  Errors,
  getAll,
  addOne,
  updateOne,
  delete: deleteOne,
} as const;
