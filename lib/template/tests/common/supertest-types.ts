import type { ParseError } from 'jet-validators/utils';
import type { Response } from 'supertest';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

// Use generics to add properties to 'body'
export interface TestRes<T = object> extends Omit<Response, 'body'> {
  body: T & { error?: string; errors?: ParseError[] };
}
