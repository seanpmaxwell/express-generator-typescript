import { Test, Response } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import User, { UserRoles } from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';
import PwdUtil from '@src/util/PwdUtil';

import Paths from './Paths';


// Login Credentials
const LoginCreds = {
  email: 'jsmith@gmail.com',
  password: 'Password@1',
} as const;

/**
 * Login a user.
 */
function login(beforeAgent: TestAgent<Test>, done: (arg: string) => void) {
  // Setup dummy data
  const role = UserRoles.Admin,
    pwdHash = PwdUtil.hashSync(LoginCreds.password),
    loginUser = User.new('john smith', LoginCreds.email, new Date(), role, 
      pwdHash);
  // Add spy
  spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);
  // Call Login API
  beforeAgent
    .post(Paths.Auth.Login)
    .type('form')
    .send(LoginCreds)
    .end((_: Error, res: Response) => {
      const cookie = res.headers['set-cookie'][0];
      return done(cookie);
    });
}


// **** Export default **** //

export default login;
