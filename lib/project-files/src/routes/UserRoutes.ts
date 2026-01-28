import { isNumber } from 'jet-validators';
import { transform } from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import User from '@src/models/User.model';
import UserService from '@src/services/UserService';

import { Req, Res } from './common/express-types';
import parseReq from './common/parseReq';

/******************************************************************************
                                Constants
******************************************************************************/

const reqValidators = {
  add: parseReq({ user: User.isComplete }),
  update: parseReq({ user: User.isComplete }),
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
async function getAll(_: Req, res: Res) {
  const users = await UserService.getAll();
  res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 *
 * @route POST /api/users/add
 */
async function add(req: Req, res: Res) {
  const { user } = reqValidators.add(req.body);
  await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 *
 * @route PUT /api/users/update
 */
async function update(req: Req, res: Res) {
  const { user } = reqValidators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 *
 * @route DELETE /api/users/delete/:id
 */
async function delete_(req: Req, res: Res) {
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
  delete: delete_,
} as const;
