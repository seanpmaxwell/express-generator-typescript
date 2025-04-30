import { Response } from 'supertest';


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
