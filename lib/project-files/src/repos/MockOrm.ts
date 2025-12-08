import jsonfile from 'jsonfile';

import ENV from '@src/common/constants/ENV';
import { NODE_ENVS } from '@src/common/constants';
import { IUser } from '@src/models/User';


/******************************************************************************
                                Constants
******************************************************************************/

const DB_FILE_NAME = (
  ENV.NodeEnv === NODE_ENVS.Test 
    ? 'database.test.json' 
    : 'database.json'
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
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as 
    Promise<IDatabase>;
}

/**
 * Update the file.
 */
function saveDb(db: IDatabase): Promise<void> {
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
