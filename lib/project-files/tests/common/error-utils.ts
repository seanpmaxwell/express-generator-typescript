import { isString } from 'jet-validators';
import { ParseError, parseJson } from 'jet-validators/utils';

/******************************************************************************
                                Types
******************************************************************************/

interface IValidationError {
  message: string;
  errors: ParseError[];
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * JSON parse a validation error.
 */
export function parseValidationError(arg: unknown): IValidationError {
  if (!isString(arg)) {
    throw new Error('Not a string');
  }
  return parseJson<IValidationError>(arg);
}
