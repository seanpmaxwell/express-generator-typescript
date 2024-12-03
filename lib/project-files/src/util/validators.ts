/**
 * NOTE: These functions were copied from here: 
 * https://github.com/seanpmaxwell/ts-validators/blob/master/src/validators.ts
 */

/* eslint-disable max-len */


// **** Types **** //

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFunc = (...args: any[]) => any;
type TBasicObj = Record<string, unknown>;
type TEnum = Record<string, string | number>;

// Add modifiers
type AddNull<T, N> = (N extends true ? T | null : T);
type AddNullables<T, O, N> = (O extends true ? AddNull<T, N> | undefined  : AddNull<T, N>);
type AddMods<T, O, N, A> = A extends true ? AddNullables<T[], O, N> : AddNullables<T, O, N>;
export type TValidateWithTransform<T> = (arg: unknown, cb?: (arg: T) => void) => arg is T;


// **** Functions **** //

// Nullables
export const isUndef = ((arg: unknown): arg is undefined => arg === undefined);
export const isNull = ((arg: unknown): arg is null => arg === null);

// Base types
export const isStr = _checkType<string>('string');
export const isNum = _checkType<number>('number');
export const isBool = _checkType<boolean>('boolean');
export const isObj = _checkType<object>('object');

// Misc
export const parseObj = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _parseObj<U, false, false, false>(arg, false, false, false, onError);
export const isEnumVal = <T>(arg: T) => _isEnumValBase<T, false, false>(arg, false, false);

// Util
export const transform = _transform;
export const safeJsonParse = _safeJsonParse;


// **** Helpers **** //

/**
 * Check if unknown is a valid enum object.
 * NOTE: this does not work for mixed enums see: "eslint@typescript-eslint/no-mixed-enums"
 */
function _isEnum(arg: unknown): arg is TEnum {
  // Check is non-array object
  if (!(isObj(arg) && !Array.isArray(arg))) {
    return false;
  }
  // Check if string or number enum
  const param = (arg as TBasicObj),
    keys = Object.keys(param),
    middle = Math.floor(keys.length / 2);
  // ** String Enum ** //
  if (!isNum(param[keys[middle]])) {
    return _checkObjEntries(arg, (key, val) => {
      return isStr(key) && isStr(val);
    });
  }
  // ** Number Enum ** //
  // Enum key length will always be even
  if (keys.length % 2 !== 0) {
    return false;
  }
  // Check key/values
  for (let i = 0; i < middle; i++) {
    const thisKey = keys[i],
      thisVal = param[thisKey],
      thatKey = keys[i + middle],
      thatVal = param[thatKey];
    if (!(thisVal === thatKey && thisKey === String(thatVal))) {
      return false;
    }
  }
  // Return
  return true;
}

/**
 * Check is value satisfies enum.
 */
function _isEnumValBase<T, 
  O extends boolean,
  N extends boolean
>(
  enumArg: T,
  optional: O,
  nullable: N,
): ((arg: unknown) => arg is AddNullables<T[keyof T], O, N>) {
  // Check is enum
  if (!_isEnum(enumArg)) {
    throw Error('Item to check from must be an enum.');
  }
  // Get keys
  let resp = Object.keys(enumArg).reduce((arr: unknown[], key) => {
    if (!arr.includes(key)) {
      arr.push(enumArg[key]);
    }
    return arr;
  }, []);
  // Check if string or number enum
  if (isNum(enumArg[resp[0] as string])) {
    resp = resp.map(item => enumArg[item as string]);
  }
  // Return validator function
  return (arg: unknown): arg is AddNullables<T[keyof T], O, N> => {
    if (isUndef(arg)) {
      return !!optional;
    }
    if (isNull(arg)) {
      return !!nullable;
    }
    return resp.some(val => arg === val);
  };
}

/**
 * Do a validator callback function for each object key/value pair.
 */
function _checkObjEntries(
  val: unknown,
  cb: (key: string, val: unknown) => boolean,
): val is NonNullable<object> {
  if (isObj(val)) {
    for (const entry of Object.entries(val)) {
      if (!cb(entry[0], entry[1])) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Wrapper to check basic type.
 */
function _checkType<T>(type: string) {
  return (arg: unknown): arg is T => {
    return typeof arg === type && (type === 'object' ? (arg !== null) : true);
  };
}

/**
 * Transform a value before checking it.
 */
function _transform<T>(
  transFn: TFunc,
  vldt: ((arg: unknown) => arg is T),
): TValidateWithTransform<T> {
  return (arg: unknown, cb?: (arg: T) => void): arg is T => {
    if (arg !== undefined) {
      arg = transFn(arg);
    }
    cb?.(arg as T);
    return vldt(arg);
  };
}

/**
 * Safe JSON parse
 */
function _safeJsonParse<T>(arg: unknown): T {
  if (isStr(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be a string');
  }
}


// **** Parse Object **** //

export interface TSchema {
  [key: string]: TValidateWithTransform<unknown> | TSchema;
}

type TInferParseRes<U, O, N, A, Schema = TInferParseResHelper<U>> = (
  AddMods<Schema, O, N, A>
);

type TInferParseResHelper<U> = {
  [K in keyof U]: (
    U[K] extends TValidateWithTransform<infer X> 
    ? X 
    : U[K] extends TSchema
    ? TInferParseResHelper<U[K]>
    : never
  );
};

type TParseOnError<A> = (
  A extends true 
  ? ((property?: string, value?: unknown, index?: number, caughtErr?: unknown) => void) 
  : ((property?: string, value?: unknown, caughtErr?: unknown) => void)
);

/**
 * validates an object schema, calls an error function is supplied one, returns 
 * "undefined" if the parse fails, and works recursively too.
 */
function _parseObj<
  U extends TSchema,
  O extends boolean,
  N extends boolean,
  A extends boolean,
>(
  schema: U,
  optional: O,
  nullable: N,
  isArr: A,
  onError?: TParseOnError<A>,
) {
  return (arg: unknown) => _parseObjCore(
    !!optional,
    !!nullable,
    !!isArr,
    schema,
    arg,
    onError,
  ) as TInferParseRes<U, O, N, A>;
}

/**
 * Validate the schema. 
 */
function _parseObjCore(
  optional: boolean,
  nullable: boolean,
  isArr: boolean,
  schema: TSchema,
  arg: unknown,
  onError?: TFunc,
) {
  // Check "undefined"
  if (arg === undefined) {
    if (!optional) {
      onError?.('object value was undefined but not optional', arg);
      return undefined;
    }
  }
  // Check "null"
  if (arg === null) {
    if (!nullable) {
      onError?.('object value was null but not nullable', arg);
      return undefined;
    }
    return null;
  }
  // Check "array"
  if (isArr) {
    if (!Array.isArray(arg)) {
      onError?.('object not an array', arg);
      return null;
    }
    // Iterate array
    const resp = [];
    for (let i = 0; i < arg.length; i++) {
      const item: unknown = arg[i];
      const parsedItem = _parseObjCoreHelper(schema, item, (prop, val, caughtErr) => {
        onError?.(prop, val, i, caughtErr);
      });
      if (parsedItem === undefined) {
        return undefined;
      } else {
        resp.push(parsedItem);
      }
    }
    return resp;
  }
  // Default
  return _parseObjCoreHelper(schema, arg, onError);
}

/**
 * Iterate an object, apply a validator function to to each property in an 
 * object using the schema.
 */
function _parseObjCoreHelper(
  schema: TSchema,
  arg: unknown,
  onError?: TParseOnError<false>,
) {
  if (!isObj(arg)) {
    return;
  }
  const retVal: TBasicObj = {};
  for (const key in schema) {
    const schemaProp = schema[key];
    let val = (arg as TBasicObj)[key];
    // Nested object
    if (typeof schemaProp === 'object') {
      const childVal = _parseObjCoreHelper(schemaProp, val, onError);
      if (childVal !== undefined) {
        val = childVal;
      } else {
        return undefined;
      }
    // Run validator
    } else if (typeof schemaProp === 'function') {
      try {
        if (!schemaProp(val, (tval: unknown) => val = tval)) {
          return onError?.(key, val);
        }
      } catch (err) {
        if (err instanceof Error) {
          return onError?.(key, val, err.message);
        } else {
          return onError?.(key, val, err);
        }
      }
    }
    retVal[key] = val;
  }
  // Return
  return retVal;
}
