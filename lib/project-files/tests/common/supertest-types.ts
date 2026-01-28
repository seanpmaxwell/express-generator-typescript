import { Response } from 'supertest';

/******************************************************************************
                                Types
******************************************************************************/

// Use generics to add properties to 'body'
export interface TestRes<T = object> extends Omit<Response, 'body'> {
  body: T & { error?: string | ErrorObject };
}

interface ErrorObject {
  message: string;
  [key: string]: unknown;
}
