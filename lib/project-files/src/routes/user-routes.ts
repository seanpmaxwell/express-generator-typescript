import StatusCodes from 'http-status-codes';

import userService from '@services/user-service';
import { IUser } from '@models/user-model';
import { IReq, IRes } from '@shared/types';


// **** Variables **** //

// Misc
const { CREATED, OK } = StatusCodes;

// Paths
const paths = {
  basePath: '/users',
  get: '/all',
  add: '/add',
  update: '/update',
  delete: '/delete/:id',
} as const;


// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await userService.getAll();
  return res.status(OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await userService.addOne(user);
  return res.status(CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await userService.updateOne(user);
  return res.status(OK).end();
}

/**
 * Delete one user.
 */
async function _delete(req: IReq, res: IRes) {
  const id = +req.params.id;
  await userService.delete(id);
  return res.status(OK).end();
}


// **** Export default **** //

export default {
  paths,
  getAll,
  add,
  update,
  delete: _delete,
} as const;
