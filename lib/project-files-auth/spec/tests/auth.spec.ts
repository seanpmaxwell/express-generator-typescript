import supertest, { SuperTest, Test, Response } from 'supertest';

import app from '@src/server';

import UserRepo from '@src/repos/UserRepo';
import PwdUtil from '@src/util/PwdUtil';
import User, { UserRoles } from '@src/models/User';
import { Errors } from '@src/services/AuthService';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import Paths from 'spec/support/Paths';
import { TReqBody } from 'spec/support/types';


// **** Variables **** //

// StatusCodes
const {
  OK,
  UNAUTHORIZED,
} = HttpStatusCodes;

// Login credentials
const LoginCreds = {
  email: 'jsmith@gmail.com',
  password: 'Password@1',
} as const;


// **** Tests **** //

describe('AuthRouter', () => {

  let agent: SuperTest<Test>;

  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  // ** Test login ** //
  describe(`"POST:${Paths.Auth.Login}"`, () => {

    const EMAIL_NOT_FOUND_ERR = Errors.EmailNotFound(LoginCreds.email);

    const callApi = (reqBody: TReqBody) => 
      agent
        .post(Paths.Auth.Login)
        .type('form')
        .send(reqBody);

    // Success
    it(`should return a response with a status of "${OK}" and a cookie with ` + 
      'a jwt if the login was successful.', (done) => {
      // Setup data
      const role = UserRoles.Standard,
        pwdHash = PwdUtil.hashSync(LoginCreds.password),
        loginUser = User.new('john smith', LoginCreds.email, role, pwdHash);
      // Add spy
      spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);
      // Call API
      callApi(LoginCreds)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(OK);
          const cookie = res.headers['set-cookie'][0];
          expect(cookie).toContain(EnvVars.CookieProps.Key);
          done();
        });
    });

    // Email not found error
    it(`should return a response with a status of "${UNAUTHORIZED}" and a ` + 
    `json with an error message of "${EMAIL_NOT_FOUND_ERR}" if the email ` + 
    'was not found.', (done) => {
      // Spy
      spyOn(UserRepo, 'getOne').and.resolveTo(null);
      // Call
      callApi(LoginCreds)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(UNAUTHORIZED);
          expect(res.body.error).toBe(EMAIL_NOT_FOUND_ERR);
          done();
        });
    });

    // Password failed
    it(`should return a response with a status of "${UNAUTHORIZED}" and a ` + 
    `json with the error "${Errors.Unauth}" if the password failed.`, 
    (done) => {
      // Setup data
      const role = UserRoles.Standard,
        pwdHash = PwdUtil.hashSync('bad password'),
        loginUser = User.new('john smith', LoginCreds.email, role, pwdHash);
      // Add spy
      spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);
      // Call API
      callApi(LoginCreds)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(UNAUTHORIZED);
          expect(res.body.error).toBe(Errors.Unauth);
          done();
        });
    });

  });

  // ** Test logout ** //
  describe(`"GET:${Paths.Auth.Logout}"`, () => {

    // Successful logout
    it(`should return a response with a status of ${OK}`, (done) => {
      agent.get(Paths.Auth.Logout)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
    });
  });
});
