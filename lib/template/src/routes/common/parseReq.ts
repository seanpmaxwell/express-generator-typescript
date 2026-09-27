import { parseObject, type Schema } from 'jet-validators/utils';

import { ValidationError } from '@src/common/classes/route-errors';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Build a request parser for `schema` that throws a `ValidationError`
 * (400) listing every failed field.
 */
function parseReq<U extends Schema>(schema: U) {
  return parseObject(schema, (errors) => {
    throw new ValidationError(errors);
  });
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default parseReq;
