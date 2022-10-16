/**
 * This function returns a middleware-function that validates the parameters 
 * provided. Each argument can be a string or array.
 * 
 * If the argument is an array the format is:
 * ['paramName', '(optional) type or validator function (default is string)', 
 * '(optional) property on "req" to extract the value from (default is body')]
 * 
 * If a string, 'validate' makes sure the param is of type string on req.body.
 * For the array, 'validate' makes sure the parameter is of the specified type
 * or that the parameter satifies the validator function. The validator  
 * function must return 'true' or 'false'.
 * 
 * **NOTE**: For numbers, strings which evalute to (!isNaN('string') => true)
 * are valid for req.query and req.params. But on req.body a number should be
 * 'typeof toCheck === "number"'
 * 
 * **NOTE**: For booleans, on req.body must be true or false, on req.query or
 * req.params must be 'true' or 'false'.
 * 
 * Sample argument: ['id', 'number'], id is the incoming variable, 'number' 
 * is the type, and body is where to extract 'id' from.
 * 
 * Example 1: validate('email', ['user', 'object'], ['id', 'number', 'params'])
 *  will check that 'email' is a string in req.body, that user is of type 
 *  object in req.body, and that 'id' is a boolean in req.params.
 * Example 2: validate('password') will check that 'password' is a string on
 *  req.body.
 * Example 3: validate(['isAdmin', 'boolean']) will check that 'isAdmin' is a 
 *  boolean on req.body
 * Example 4: validate(['user', isInstanceOfUser]) will check that 'user' 
 *  satifies the 'isInstanceOfUser()' function.
 * Example 5: validate(['email']) will check that 'email' is a string in 
 *  req.body,
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

import HttpStatusCodes from '@configurations/HttpStatusCodes';
import { TAll } from '@declarations/types';


// **** Variables **** //

export const paramInvalidErr = 'One or more of the required params was ' + 
  'missing or invalid.';


// **** Types **** //

type TLoopFn = (req: Request) => boolean;
type TValidatorFn =  ((arg: TAll) => boolean);
type TReqObjProps = 'body' | 'query' | 'params';

type TParamArr = {
  0: string,
  1?: string | TValidatorFn,
  2?: TReqObjProps,
}

interface IParamFields {
  paramName: string; 
  type: string; 
  reqObjProp: TReqObjProps;
}


// **** Functions **** //

/**
 * See comments at beginning of file on usage.
 */
function validate(...params: Array<string | TParamArr>): RequestHandler {
  // Setup loop-function array
  const loopFns: TLoopFn[] = [];
  for (const param of params) {
    const { paramName, type, reqObjProp } = getParamFields(param);
    let loopFn: TLoopFn = () => false;
    if (type === 'string') {
      loopFn = checkStr(reqObjProp, paramName);
    } else if (type === 'number') {
      loopFn = checkNum(reqObjProp, paramName);
    } else if (type === 'boolean') {
      loopFn = checkBool(reqObjProp, paramName);
    } else if (type === 'function') {
      const fn = param[1] as TValidatorFn;
      loopFn = checkValidatorFn(reqObjProp, paramName, fn);
    } else {
      loopFn = checkDefault(reqObjProp, paramName, type);
    }
    loopFns.push(loopFn);
  }
  // Return middlware function
  return (req: Request, res: Response, next: NextFunction) => {
    for (const loopFn of loopFns) {
      if (!loopFn(req)) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ error: paramInvalidErr });
      }
    }
    return next();
  };
}

/**
 * Get the param name, type to check against, and the request object property
 * as well as validating the format of the param.
 */
function getParamFields(param: string | TParamArr): IParamFields {
  let paramName = '';
  let type = 'string';
  let reqObjProp: TReqObjProps = 'body';
  // Param is string
  if (typeof param === 'string') {
    paramName = param;
  // Param is array
  } else if (param instanceof Array) {
    // Get the param name
    paramName = param[0];
    if (typeof paramName !== 'string') {
      throw Error('param name must be a string');
    }
    // Get the type
    if (typeof param[1] === 'string') {
      type = param[1];
    } else if (typeof param[1] === 'function') {
      type = 'function';
    } else {
      throw Error('param[1] must be a string or a validator function');
    }
    // Get the request object property
    const prop = (param.length >= 3 ? param[2] : 'body');
    if (prop !== 'body' && prop !== 'params' && prop !== 'query') {
      throw Error('param[2] must be "body", "query", or "params"');
    } else {
      reqObjProp = prop;
    }
  // Throw error if not string or array
  } else {
    throw Error('"validate()" argument must be a string or array');
  }
  // Return
  return { paramName, type, reqObjProp };
}

/**
 * Check param is a valid string.
 */
function checkStr(reqObjProp: TReqObjProps, paramName: string): TLoopFn {
  return getLoopFn(reqObjProp, paramName, (toCheck) => {
    return (typeof toCheck === 'string');
  });
}

/**
 * Check param is a valid number. See notes at beginning of file.
 */
function checkNum(reqObjProp: TReqObjProps, paramName: string): TLoopFn {
  return getLoopFn(reqObjProp, paramName, (toCheck) => {
    if (reqObjProp === 'query' || reqObjProp === 'params') {
      return !isNaN(toCheck as number);
    } else if (reqObjProp === 'body' && typeof toCheck !== 'number') {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * Check param is a valid boolean. See notes at beginning of file.
 */
function checkBool(reqObjProp: TReqObjProps, paramName: string): TLoopFn {
  return getLoopFn(reqObjProp, paramName, (toCheck) => {
    if (reqObjProp === 'query' || reqObjProp === 'params') {
      return isBool(toCheck as boolean);
    } else if (reqObjProp === 'body' && typeof toCheck !== 'boolean') {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * Checks if arg is a boolean, or a string that is 'true', or 'false'.
 */
function isBool(arg: string | boolean): boolean {
  if (typeof arg === 'boolean') {
    return true;
  } else if (typeof arg === 'string') {
    arg = arg.toLowerCase();
    return (arg === 'true' || arg === 'false');
  } else {
    return false;
  }
}

/**
 * Make sure the parameter satifies the supplied validator function.
 */
function checkValidatorFn(
  reqObjProp: TReqObjProps,
  paramName: string,
  validatorFn: TValidatorFn,
) {
  return getLoopFn(reqObjProp, paramName, (toCheck) => {
    return validatorFn(toCheck);
  });
}

/**
 * For all other type make sure the param equals the type.
 */
function checkDefault(
  reqObjProp: TReqObjProps,
  paramName: string,
  type: string,
): TLoopFn {
  return getLoopFn(reqObjProp, paramName, (toCheck) => {
    return (toCheck === type);
  });
}

/**
 * Extract the value to check and get the loop function.
 */
function getLoopFn(
  reqObjProp: TReqObjProps,
  paramName: string,
  cb: (toCheck: TAll) => boolean,
): TLoopFn {
  return (req: Request) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const toCheck = req[reqObjProp][paramName] as TAll;
    return cb(toCheck);
  };
}


// **** Export Default **** //

export default validate;
