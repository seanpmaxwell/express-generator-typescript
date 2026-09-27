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
async function add(user: UserEntity): Promise<void> {
  const db = await orm.openDb();
  db.users.push(user);
  return orm.saveDb(db);
}

/**
 * Update a user.
 */
async function update(user: UserEntity): Promise<void> {
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
async function delete_(id: string): Promise<void> {
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
 * @testOnly
 *
 * Delete every user record.
 */
async function deleteAllUsers(): Promise<void> {
  const db = await orm.openDb();
  db.users = [];
  return orm.saveDb(db);
}

/**
 * @testOnly
 *
 * Insert copies of `users` with fresh ids; the inputs are not modified.
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

export default {
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  insertMultiple,
} as const;
