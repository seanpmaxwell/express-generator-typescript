// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

export type ISOString =
  `${number}-${number}-${number}T${number}:${number}:${number}${string}`;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Return the current-date (or a provided date) as an ISOString.
 */
export function getISOString(date = new Date()): ISOString {
  return date.toISOString() as ISOString;
}

/**
 * Validate an ISOString.
 */
export function isISOString(value: unknown): value is ISOString {
  try {
    const date = new Date(value as string);
    return !isNaN(date.getTime()) && date.toISOString() === value;
  } catch {
    return false;
  }
}
