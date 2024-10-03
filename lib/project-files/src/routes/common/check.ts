import { ValidationErr } from '@src/common/classes';


type TReqObj = Record<string, unknown>;


/**
 * Check that param/s is a string
 */
function isStr(reqObj: TReqObj, params: string): string;
function isStr(reqObj: TReqObj, params: ReadonlyArray<string>): string[];
function isStr(
  reqObj: TReqObj,
  params: string | ReadonlyArray<string>,
): string | string[] {
  return _checkWrapper(reqObj, params, _checkStr);
}

/**
 * Check validator for string
 */
function _checkStr(val: unknown): string | undefined {
  if (!!val && typeof val === 'string') {
    return val;
  } else {
    return undefined;
  }
}

/**
 * Check that param/s is a number.
 */
function isNum(reqObj: TReqObj, params: string): number;
function isNum(reqObj: TReqObj, params: ReadonlyArray<string>): number[];
function isNum(
  reqObj: TReqObj,
  params: string | ReadonlyArray<string>,
): number | number[] {
  return _checkWrapper(reqObj, params, _checkNum);
}

/**
 * Check validator for string
 */
function _checkNum(val: unknown): number | undefined {
  const valF = Number(val);
  if (!isNaN(valF)) {
    return valF;
  } else {
    return undefined;
  }
}

/**
 * Check that param/s is a number
 */
function isBool(reqObj: TReqObj, params: string): boolean;
function isBool(reqObj: TReqObj, params: ReadonlyArray<string>): boolean[];
function isBool(
  reqObj: TReqObj,
  params: string | ReadonlyArray<string>,
): boolean | boolean[] {
  return _checkWrapper(reqObj, params, _checkBool);
}

/**
 * Check validator for string
 */
function _checkBool(val: unknown): boolean | undefined {
  if (typeof val === 'boolean') {
    return val;
  } else if (typeof val === 'string') {
    val = val.toLowerCase();
    if (val === 'true') {
      return true;
    } else if (val === 'false') {
      return false;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

/**
 * Check that param satisfies the validator function.
 */
function isValid<T>(
  reqObj: TReqObj,
  param: string,
  validatorFn: (param: unknown) => param is T,
): T {
  const val = reqObj[param];
  if (validatorFn(val)) {
    return val;
  } else {
    throw new ValidationErr(param);
  }
}


// **** Shared Helpers **** //

/**
 * Do stuff based on whether or not params is an array
 */
function _checkWrapper<T>(
  reqObj: TReqObj,
  params: string | ReadonlyArray<string>,
  checkFn: (val: unknown) => T | undefined,
): T | T[] {
  // If is array
  if (params instanceof Array) {
    const retVal: T[] = [];
    for (const param of params) {
      const val = checkFn(reqObj[param]);
      if (val !== undefined) {
        retVal.push(val);
      } else {
        throw new ValidationErr(param);
      }
    }
    return retVal;
  }
  // If not an array
  const val = checkFn(reqObj[params]);
  if (val !== undefined) {
    return val;
  }
  // Throw error
  throw new ValidationErr(params);
}


// **** Export Default **** //

export default {
  isStr,
  isNum,
  isBool,
  isValid,
} as const;