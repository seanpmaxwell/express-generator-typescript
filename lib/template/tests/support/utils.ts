import type { Response } from 'supertest';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

export type TypedRes<T> = Omit<Response, 'body'> & { body: T };
export type TypedErrRes<T = 'string'> = TypedRes<{ error: T }>;

interface ValidationError {
  errors: { message: string }[];
}

// ========================================================================= //
//                                  HELPERS                                  //
// ========================================================================= //

/**
 * Get the error message from a superTest Response object.
 */
export function extractErrMsg(res: TypedRes<ValidationError[]>) {
  return res.body[0].errors[0].message;
}
