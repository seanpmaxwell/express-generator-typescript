// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

export type ValueOf<T> = T[keyof T];
type Table = Record<string, string> | Record<string, number>;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

/**
 * Check if an `unknown` is a number type.
 */
export function isNumber<T>(val: T): val is Extract<T, number> {
  return typeof val === 'number' && !isNaN(val);
}

/**
 * Check if an `unknown` is a value of an object.
 */
export function isValueOf<T extends Table>(
  table: T,
): (v: unknown) => v is ValueOf<T> {
  const vals = Object.values(table);
  const set = new Set(vals);
  return (val: unknown): val is ValueOf<T> => set.has(val);
}
