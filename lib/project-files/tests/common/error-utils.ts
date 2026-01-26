import { isString } from 'jet-validators';
import { ParseError, parseJson } from 'jet-validators/utils';

/******************************************************************************
                                Types
******************************************************************************/

type ValidationError = {
  message: string;
  errors: ParseError[];
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * JSON parse a validation error.
 */
export function parseValidationError(arg: unknown): ValidationError {
  if (!isString(arg)) {
    throw new Error('Not a string');
  }
  return parseJson<ValidationError>(arg);
}
