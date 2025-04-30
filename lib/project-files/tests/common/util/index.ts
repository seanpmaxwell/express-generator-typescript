import { Response } from 'supertest';
import { IParseObjectError, parseJson } from 'jet-validators/utils';
import { isString } from 'jet-validators';


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

interface IValidationErr {
  message: string;
  errors: IParseObjectError[];
}


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * JSON parse a validation error.
 */
export function parseValidationErr(arg: unknown): IValidationErr {
  if (!isString(arg)) {
    throw new Error('Not a string');
  }
  return parseJson<IValidationErr>(arg);
}
