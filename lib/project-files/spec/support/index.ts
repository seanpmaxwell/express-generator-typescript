import { Response } from 'supertest';
import { TParseReqErr } from '@src/routes/common';
import UserRepo from '@src/repos/UserRepo';


/******************************************************************************
                                Types
******************************************************************************/

// Use generics to add properties to 'body'
export type TRes<T = object> = Omit<Response, 'body'> & {
  body: T & { error?: string | IErrObj },
};

interface IErrObj {
  message: string;
  [key: string]: unknown;
}

export interface IValidationErr {
  message: string;
  parameters: TParseReqErr[];
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
