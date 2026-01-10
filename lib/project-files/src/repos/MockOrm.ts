import jsonfile from 'jsonfile';

import EnvVars from '@src/common/constants/EnvVars';
import { NodeEnvs } from '@src/common/constants';
import { IUser } from '@src/models/User';


/******************************************************************************
                                Constants
******************************************************************************/

const DB_FILE_NAME = (
  EnvVars.NodeEnv === NodeEnvs.TEST 
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
