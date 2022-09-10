import bcrypt from 'bcrypt';
import { SuperTest, Test, Response } from 'supertest';

import User, { UserRoles } from '@models/user-model';
import userRepo from '@repos/user-repo';


// **** Variables **** //

export const pwdSaltRounds = 12;

const creds = {
  email: 'jsmith@gmail.com',
  password: 'Password@1',
} as const;


// **** Functions **** //

/**
 * Login a user.
 */
function login(beforeAgent: SuperTest<Test>, done: (arg: string) => void) {
  // Setup dummy data
  const role = UserRoles.Admin;
  const pwdHash = bcrypt.hashSync(creds.password, pwdSaltRounds);
  const loginUser = User.new('john smith', creds.email, role, pwdHash);
  spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
  // Call Login API
  beforeAgent
    .post('/api/auth/login')
    .type('form')
    .send(creds)
    .end((err: Error, res: Response) => {
      if (err) {
        throw err;
      }
      const cookie = res.headers['set-cookie'][0];
      return done(cookie);
    });
}


// **** Export default **** //

export default {
  login,
} as const;
