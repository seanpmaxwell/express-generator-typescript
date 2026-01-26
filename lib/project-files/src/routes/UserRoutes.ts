import { isNumber } from 'jet-validators';
import { transform } from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import UserModel from '@src/models/UserModel';
import UserService from '@src/services/UserService';

import { IReq, IRes } from './common/express-types';
import parseReq from './common/parseReq';

/******************************************************************************
                                Constants
******************************************************************************/

const reqValidators = {
  add: parseReq({ user: UserModel.isComplete }),
  update: parseReq({ user: UserModel.isComplete }),
  delete: parseReq({ id: transform(Number, isNumber) }),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 *
 * @route GET /api/users/all
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 *
 * @route POST /api/users/add
 */
async function add(req: IReq, res: IRes) {
  const { user } = reqValidators.add(req.body);
  await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 *
 * @route PUT /api/users/update
 */
async function update(req: IReq, res: IRes) {
  const { user } = reqValidators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 *
 * @route DELETE /api/users/delete/:id
 */
async function __delete__(req: IReq, res: IRes) {
  const { id } = reqValidators.delete(req.params);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  add,
  update,
  delete: __delete__,
} as const;
