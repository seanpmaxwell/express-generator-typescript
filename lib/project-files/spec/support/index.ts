import { isValidDate } from 'jet-validators';
import { traverseObject } from 'jet-validators/utils';

import { IReqPropErr } from '@src/routes/common';
import UserRepo from '@src/repos/UserRepo';


/******************************************************************************
                                Types
******************************************************************************/

export interface IValidationErr {
  message: string;
  parameters: IReqPropErr[];
}


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Delete all records for unit testing.
 */
export async function cleanDatabase(): Promise<void> {
  await Promise.all([
    UserRepo.deleteAllUsers(),
  ]);
}

/**
 * Put things you need to do to modify the resp body object here.
 */
export function parseResBody(body: unknown) {
  return traverseObject((key, val, parentObj) => {
    if (key === 'created' && isValidDate(val)) {
      parentObj[key] = new Date(val);
    }
  })(body);
}
