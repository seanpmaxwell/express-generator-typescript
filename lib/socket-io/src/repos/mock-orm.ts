/* eslint-disable @typescript-eslint/no-unsafe-return */

import jsonfile from 'jsonfile';
import { IUser } from '@models/user-model';


// **** Variables **** //

const dbFilePath = 'src/repos/database.json';


// **** Types **** //

interface IDb {
  users: IUser[];
}


// **** Functions **** //

/**
 * Fetch the json from the file.
 */
function openDb(): Promise<IDb> {
  return jsonfile.readFile(dbFilePath);
}

/**
 * Update the file.
 */
function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile(dbFilePath, db);
}


// **** Export default **** //

export default {
    openDb,
    saveDb,
} as const;