import jsonfile from 'jsonfile';
import tspo from 'tspo';

import EnvVars, { NodeEnvs } from '@src/common/constants/env';
import { IUser } from '@src/models/User.model';

/******************************************************************************
                                Constants
******************************************************************************/

const DATABASE_FILE_PATH =
  __dirname +
  '/common' +
  (EnvVars.NodeEnv === NodeEnvs.TEST
    ? '/database.test.json'
    : '/database.json');

/******************************************************************************
                                Types
******************************************************************************/

type Database = {
  users: IUser[];
};

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Fetch the json from the file.
 */
async function openDb(): Promise<Database> {
  const db = await (jsonfile.readFile(DATABASE_FILE_PATH) as Promise<Database>);
  if (!('users' in db)) {
    return tspo.addEntry(db, ['users', []]);
  }
  return db;
}

/**
 * Update the file.
 */
function saveDb(db: Database): Promise<void> {
  return jsonfile.writeFile(DATABASE_FILE_PATH, db);
}

/**
 * Empty the database
 */
function cleanDb(): Promise<void> {
  return jsonfile.writeFile(DATABASE_FILE_PATH, {});
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  openDb,
  saveDb,
  cleanDb,
} as const;
