import { parseObject, TSchema } from 'jet-validators/utils';

import { ValidationError } from '@src/common/util/route-errors';


/******************************************************************************
                              Functions
******************************************************************************/

/**
 * Throw a "ParseObjError" when "parseObject" fails. Also extract a nested 
 * "ParseObjError" and add it to the nestedErrors array.
 */
export function parseReq<U extends TSchema>(schema: U) {
  return parseObject(schema, errors => {
    throw new ValidationError(errors);
  });
}
