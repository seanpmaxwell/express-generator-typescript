import StatusCodes from 'http-status-codes';
import { Router } from 'express';

import userService from '@services/user-service';
import User, { IUser } from '@models/user-model';
import { IReq, IRes } from '@shared/types';
import { vld } from './middleware';



// **** Variables **** //

// Misc
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
  basePath: '/users',
  get: '/all',
  add: '/add',
  update: '/update',
  delete: '/delete/:id',
} as const;


// **** Setup Router **** //

// Validators (place shared or really long ones here)
const validateUser = vld(['user', User.instanceOf]);

// Add routes to express
const router = Router();
router.get(p.get, getAll);
router.post(p.add, validateUser, add);
router.put(p.update, validateUser, update);
router.delete(p.delete, vld(['id', 'number', 'params']), _delete);


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

export default router;
