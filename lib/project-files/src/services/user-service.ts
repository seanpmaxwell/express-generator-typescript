import userRepo from '@repos/user-repo';
import { IUser } from '@models/User';
import { IServiceErr } from '@declarations/interfaces';
import HttpStatusCodes from '@configurations/HttpStatusCodes';


// **** Variables **** //

const userNotFoundErr: IServiceErr = {
  status: HttpStatusCodes.NOT_FOUND,
  msg: 'User not found',
} as const;


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
async function updateOne(user: IUser): Promise<void | IServiceErr> {
  const persists = await userRepo.persists(user.id);
  if (!persists) {
    return userNotFoundErr;
  }
  // Return user
  return userRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void | IServiceErr> {
  const persists = await userRepo.persists(id);
  if (!persists) {
    return userNotFoundErr;
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
