import { Router } from 'express';
import validate from 'express-zod-safe';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import User from '@src/entities/User';
import UserService from '@src/services/UserService';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// Shorthand for the path strings
const P = {
  GET: Paths.Users.Get.PATH,
  ADD: Paths.Users.Add.PATH,
  UPDATE: Paths.Users.Update.PATH,
  DELETE: Paths.Users.Delete.PATH,
} as const;

// Middlware `validators`
const V = {
  add: validate({ body: { user: User.Schemas.Input } }),
  update: validate({ body: { user: User.Schemas.Main } }),
  delete: validate({ params: { id: User.Schemas.Id } }),
} as const;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const router = Router();

// Get all users
router.get(P.GET, async (_, res) => {
  const users = await UserService.getAll();
  res.status(HttpStatusCodes.OK).json({ users });
});

// Add one user
router.post(P.ADD, V.add, async (req, res) => {
  const { user } = req.body;
  const created = await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).json({ user: created });
});

// Update one user
router.put(P.UPDATE, V.update, async (req, res) => {
  const { user } = req.body;
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
});

// Delete one user
router.delete(P.DELETE, V.delete, async (req, res) => {
  const { id } = req.params;
  await UserService.deleteOne(id);
  res.status(HttpStatusCodes.OK).end();
});

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default router;
