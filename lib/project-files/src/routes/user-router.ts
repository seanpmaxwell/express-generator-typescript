import StatusCodes from 'http-status-codes';
import { Router } from 'express';

import userService from '@services/user-service';
import { ParamMissingError } from '@shared/errors';
import { IUser } from '@models/user-model';
import { IReq, IRes } from '@shared/types';


// **** Variables **** //

// Misc
const router = Router(),
  { CREATED, OK } = StatusCodes;

// Paths
export const p = {
  get: '/all',
  add: '/add',
  update: '/update',
  delete: '/delete/:id',
} as const;


// **** Routes **** //

/**
 * Get all users.
 */
router.get(p.get, async (_: IReq, res: IRes) => {
  const users = await userService.getAll();
  return res.status(OK).json({ users });
});

/**
 * Add one user.
 */
router.post(p.add, async (req: IReq<{user: IUser}>, res: IRes) => {
  const { user } = req.body;
  if (!user) {
    throw new ParamMissingError();
  }
  await userService.addOne(user);
  return res.status(CREATED).end();
});

/**
 * Update one user.
 */
router.put(p.update, async (req: IReq<{user: IUser}>, res: IRes) => {
  const { user } = req.body;
  if (!user) {
    throw new ParamMissingError();
  }
  await userService.updateOne(user);
  return res.status(OK).end();
});

/**
 * Delete one user.
 */
router.delete(p.delete, async (req: IReq, res: IRes) => {
  const { id } = req.params;
  if (!id) {
    throw new ParamMissingError();
  }
  await userService.delete(Number(id));
  return res.status(OK).end();
});


// **** Export default **** //

export default router;
