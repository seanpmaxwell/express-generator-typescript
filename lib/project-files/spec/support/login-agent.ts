import { SuperTest, Test, Response } from 'supertest';

import User, { UserRoles } from '@src/models/User';
import userRepo from '@src/repos/user-repo';
import pwdUtil from '@src/util/pwd-util';


// **** Variables **** //

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
  const pwdHash = pwdUtil.hashSync(creds.password);
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
