import { z } from 'zod';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

export type ISOString =
  `${number}-${number}-${number}T${number}:${number}:${number}${string}`;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

export const ISOStringSchema = z.iso
  .datetime()
  .transform((value) => value as ISOString);

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Return the current-date (or a provided date) as an ISOString.
 */
export function getISOString(date = new Date()): ISOString {
  return date.toISOString() as ISOString;
}
