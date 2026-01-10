import { isNonEmptyString, isString, isUnsignedInteger } from 'jet-validators';
import {
  parseObject,
  Schema,
  testObject,
} from 'jet-validators/utils';

import { transformIsDate } from '@src/common/utils/validators';
import { IModel } from './common/types';

/******************************************************************************
                                 Constants
******************************************************************************/

const GetDefaults = (): IUser => ({
  id: 0,
  name: '',
  email: '',
  created: new Date(),
});

/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser extends IModel {
  name: string;
  email: string;
}

/******************************************************************************
                                  Setup
******************************************************************************/

const schema: Schema<IUser> = {
  id: isUnsignedInteger,
  name: isString,
  email: isString,
  created: transformIsDate,
};

// Set the "parseUser" function
const parseUser = parseObject<IUser>(schema);

// For the APIs make sure the right fields are complete
const testIsCompleteUser = testObject<IUser>({
  ...schema,
  name: isNonEmptyString,
  email: isNonEmptyString,
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function __new__(user?: Partial<IUser>): IUser {
  return parseUser({ ...GetDefaults(), ...user }, errors => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: __new__,
  isComplete: testIsCompleteUser,
} as const;