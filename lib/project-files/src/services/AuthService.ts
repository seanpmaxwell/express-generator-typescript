import UserRepo from '@src/repos/UserRepo';

import JwtUtil from '@src/util/JwtUtil';
import PwdUtil from '@src/util/PwdUtil';
import { tick } from '@src/util/misc';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';


// **** Variables **** //

// Errors
export const Errors = {
  Unauth: 'Unauthorized',
  emailNotFound: (email: string) => `User with email "${email}" not found`,
} as const;


// **** Functions **** //

/**
 * Login a user.
 */
async function getJwt(email: string, password: string): Promise<string> {
  // Fetch user
  const user = await UserRepo.getOne(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.emailNotFound(email),
    );
  }
  // Check password
  const hash = (user.pwdHash ?? ''),
    pwdPassed = await PwdUtil.compare(password, hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED, 
      Errors.Unauth,
    );
  }
  // Setup Admin Cookie
  return JwtUtil.sign({
    id: user.id,
    email: user.name,
    name: user.name,
    role: user.role,
  });
}


// **** Export default **** //

export default {
  getJwt,
} as const;
