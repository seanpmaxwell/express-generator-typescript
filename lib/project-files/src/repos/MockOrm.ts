import jsonfile from 'jsonfile';

import EnvVars, { NodeEnvs } from '@src/common/constants/env';
import { IUser } from '@src/models/User';

/******************************************************************************
                                Constants
******************************************************************************/

const DATABASE_FILE_PATH = __dirname + '/common' + (
  EnvVars.NodeEnv === NodeEnvs.TEST 
  ? '/database.test.json' 
  : '/database.json'
);

/******************************************************************************
                                Types
******************************************************************************/

interface IDatabase {
  users: IUser[];
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Fetch the json from the file.
 */
function openDb(): Promise<IDatabase> {
  return jsonfile.readFile(DATABASE_FILE_PATH) as Promise<IDatabase>;
}

/**
 * Update the file.
 */
function saveDb(db: IDatabase): Promise<void> {
  return jsonfile.writeFile(DATABASE_FILE_PATH, db);
}

/**
 * Empty the database
 */
function cleanDb(): Promise<void> {
  return jsonfile.writeFile( DATABASE_FILE_PATH, {});
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  openDb,
  saveDb,
  cleanDb,
} as const;
