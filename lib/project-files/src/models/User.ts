import moment from 'moment';


// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';


// **** Types **** //

export interface IUser {
  id: number;
  name: string;
  email: string;
  created: Date;
}


// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  name?: string,
  email?: string,
  created?: Date,
  id?: number, // id last cause usually set by db
): IUser {
  return {
    id: (id ?? -1),
    name: (name ?? ''),
    email: (email ?? ''),
    created: (created ? new Date(created) : new Date()),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IUser {
  if (isUser(param)) {
    return new_(param.name, param.email, param.created, param.id);
  }
  throw new Error(INVALID_CONSTRUCTOR_PARAM);
}

/**
 * See if the param meets criteria to be a user.
 */
function isUser(arg: unknown): arg is IUser {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg && typeof arg.id === 'number' && 
    'email' in arg && typeof arg.email === 'string' && 
    'name' in arg && typeof arg.name === 'string' &&
    'created' in arg && moment(arg.created as string | Date).isValid()
  );
}


// **** Export default **** //

export default {
  new: new_,
  from,
  isUser,
} as const;
