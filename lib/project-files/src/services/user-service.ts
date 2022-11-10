import userRepo from '@src/repos/user-repo';
import { IUser } from '@src/models/User';
import { RouteError } from '@src/declarations/classes';
import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';


// **** Variables **** //

export const userNotFoundErr = 'User not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return userRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return userRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await userRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      userNotFoundErr,
    );
  }
  // Return user
  return userRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await userRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      userNotFoundErr,
    );
  }
  // Delete user
  return userRepo.delete(id);
}


// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
