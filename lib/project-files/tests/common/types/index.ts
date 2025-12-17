import { Response } from 'supertest';


/******************************************************************************
                                Types
******************************************************************************/

// Use generics to add properties to 'body'
export type TRes<T = object> = Omit<Response, 'body'> & {
  body: T & { error?: string | IErrorObject },
};

interface IErrorObject {
  message: string;
  [key: string]: unknown;
}
