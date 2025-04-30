import jsonfile from 'jsonfile';

import ENV from '@src/common/constants/ENV';
import { NodeEnvs } from '@src/common/constants';
import { IUser } from '@src/models/User';


/******************************************************************************
                                Constants
******************************************************************************/

const DB_FILE_NAME = (
  ENV.NodeEnv === NodeEnvs.Test 
    ? 'database.test.json' 
    : 'database.json'
);


/******************************************************************************
                                Types
******************************************************************************/

interface IDb {
  users: IUser[];
}


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Fetch the json from the file.
 */
function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

/**
 * Update the file.
 */
function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
}

/**
 * Empty the database
 */
function cleanDb(): Promise<void> {
  return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), {});
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  openDb,
  saveDb,
  cleanDb,
} as const;
