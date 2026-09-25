import { ParseError } from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

// ========================================================================= //
//                                  CLASSES                                  //
// ========================================================================= //

/**
 * Error with status code and message. `errors` (optional) is sent to the
 * client alongside the message.
 */
export class RouteError extends Error {
  public status: HttpStatusCodes;
  public errors?: unknown[];

  public constructor(
    status: HttpStatusCodes,
    message: string,
    errors?: unknown[],
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Request data failed schema validation.
 */
export class ValidationError extends RouteError {
  public static MESSAGE = 'Request validation failed.';

  public constructor(errors: ParseError[]) {
    super(HttpStatusCodes.BAD_REQUEST, ValidationError.MESSAGE, errors);
  }
}
