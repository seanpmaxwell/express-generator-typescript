import jetid from 'jet-id';

import { getISOString } from '@src/common/utils/date-utils';
import type { UserEntity } from '@src/entities/User';

import orm from './MockOrm';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * See if a user with the given id exists.
 */
async function persists(id: string): Promise<boolean> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return true;
    }
  }
  return false;
}

/**
 * Get all users.
 */
async function getAll(): Promise<UserEntity[]> {
  const db = await orm.openDb();
  return db.users;
}

/**
 * Add one user.
 */
async function addOne(user: UserEntity): Promise<void> {
  const db = await orm.openDb();
  db.users.push(user);
  return orm.saveDb(db);
}

/**
 * Update a user.
 */
async function updateOne(user: UserEntity): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === user.id) {
      const dbUser = db.users[i];
      db.users[i] = {
        ...dbUser,
        name: user.name,
        email: user.email,
      };
      return orm.saveDb(db);
    }
  }
}

/**
 * Delete one user.
 */
async function deleteOne(id: string): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === id) {
      db.users.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}

// ============================ Unit-tests Only ============================ //

/**
 * Delete every user record.
 *
 * @testOnly
 */
async function deleteAllUsers(): Promise<void> {
  const db = await orm.openDb();
  db.users = [];
  return orm.saveDb(db);
}

/**
 * Insert copies of `users` with fresh ids; the inputs are not modified.
 *
 * @testOnly
 */
async function insertMultiple(
  users: UserEntity[] | readonly UserEntity[],
): Promise<UserEntity[]> {
  const db = await orm.openDb();
  const inserted = users.map((user) => ({
    ...user,
    id: jetid(),
    created: getISOString(),
  }));
  db.users = [...db.users, ...inserted];
  await orm.saveDb(db);
  return inserted;
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export const UserRepoTestOnly = {
  deleteAllUsers,
  insertMultiple,
} as const;

export default {
  persists,
  getAll,
  addOne,
  updateOne,
  deleteOne,
} as const;
