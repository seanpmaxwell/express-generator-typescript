import userRepo from '@repos/user-repo';
import jwtUtil from '@util/jwt-util';
import pwdUtil from '@util/pwd-util';
import HttpStatusCodes from '@configurations/HttpStatusCodes';
import { RouteError } from '@declarations/classes';


// **** Variables **** //

// Errors
export const errors = {
  unauth: 'Unauthorized',
  emailNotFound: (email: string) => `User with email "${email}" not found`,
} as const;


// **** Functions **** //

/**
 * Login a user.
 */
async function getJwt(email: string, password: string): Promise<string> {
  // Fetch user
  const user = await userRepo.getOne(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      errors.emailNotFound(email),
    );
  }
  // Check password
  const hash = (user.pwdHash ?? '');
  const pwdPassed = await pwdUtil.compare(password, hash);
  if (!pwdPassed) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED, 
      errors.unauth,
    );
  }
  // Setup Admin Cookie
  return jwtUtil.sign({
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
