import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import User from '@src/entities/User';
import UserService from '@src/services/UserService';

import type { Req, Res } from './common/express-types';
import parseReq from './common/parseReq';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const reqValidators = {
  add: parseReq({ user: User.isInput }),
  update: parseReq({ user: User.isComplete }),
  delete: parseReq({ id: User.isId }),
} as const;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

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
  const created = await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).json({ user: created });
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
 * @route DELETE /api/users/delete?id=:id
 */
async function delete_(req: Req, res: Res) {
  const { id } = reqValidators.delete(req.query);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
