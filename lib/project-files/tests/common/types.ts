import { Response } from 'supertest';

/******************************************************************************
                                Types
******************************************************************************/

// Use generics to add properties to 'body'
export interface IRes<T = object> extends Omit<Response, 'body'> {
  body: T & { error?: string | IErrorObject };
}

interface IErrorObject {
  message: string;
  [key: string]: unknown;
}
