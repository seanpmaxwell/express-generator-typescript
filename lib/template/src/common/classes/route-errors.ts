import HttpStatusCodes from '#src/common/constants/HttpStatusCodes.ts';

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
 * Don't have to manually pass `HttpStatusCodes.NOT_FOUND` each time.
 */
export class NotFoundError extends RouteError {
  public constructor(message: string) {
    super(HttpStatusCodes.NOT_FOUND, message);
  }
}
