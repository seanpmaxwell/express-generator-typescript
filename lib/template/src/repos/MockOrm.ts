import fs from 'fs/promises';
import jsonfile from 'jsonfile';
import path from 'path';

import EnvVars, { NodeEnvs } from '@src/common/constants/env';
import { IUser } from '@src/models/User.model';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const DATABASE_FILE_PATH = path.join(
  __dirname,
  'common',
  EnvVars.NodeEnv === NodeEnvs.TEST ? 'database.test.json' : 'database.json',
);

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

type Database = {
  users: IUser[];
};

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

// NOTE: Every write is a read-modify-write of one JSON file with no locking,
// so concurrent requests can overwrite each other. Swap this module for a
// real database before relying on it.

/**
 * Fetch the json from the file. A missing file is an empty database.
 */
async function openDb(): Promise<Database> {
  let db: Partial<Database>;
  try {
    db = (await jsonfile.readFile(DATABASE_FILE_PATH)) as Partial<Database>;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
    db = {};
  }
  return { users: db.users ?? [] };
}

/**
 * Update the file, creating its folder if needed.
 */
async function saveDb(db: Database): Promise<void> {
  await fs.mkdir(path.dirname(DATABASE_FILE_PATH), { recursive: true });
  return jsonfile.writeFile(DATABASE_FILE_PATH, db, { spaces: 2 });
}

/**
 * Empty the database
 */
function cleanDb(): Promise<void> {
  return saveDb({ users: [] });
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  openDb,
  saveDb,
  cleanDb,
} as const;
