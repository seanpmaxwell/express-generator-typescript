import userRepo from '@repos/user-repo';
import { IUser } from '@models/user-model';
import { UserNotFoundError } from '@shared/errors';


// **** Functions **** //

/**
 * Get all users
 */
function getAll(): Promise<IUser[]> {
  return userRepo.getAll();
}

/**
 * Add one user
 */
function addOne(user: IUser): Promise<void> {
  return userRepo.add(user);
}

/**
 * Update one user
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await userRepo.persists(user.id);
  if (!persists) {
    throw new UserNotFoundError();
  }
  return userRepo.update(user);
}

/**
 * Delete a user by their id
 */
async function _delete(id: number): Promise<void> {
  const persists = await userRepo.persists(id);
  if (!persists) {
    throw new UserNotFoundError();
  }
  return userRepo.delete(id);
}


// **** Export default **** //

export default {
    getAll,
    addOne,
    updateOne,
    delete: _delete,
} as const;
