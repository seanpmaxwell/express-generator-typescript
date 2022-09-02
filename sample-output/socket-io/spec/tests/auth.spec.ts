import bcrypt from 'bcrypt';
import StatusCodes from 'http-status-codes';
import supertest, { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import userRepo from '@repos/user-repo';
import envVars from '@shared/env-vars';
import User, { UserRoles } from '@models/user-model';
import { p as paths } from '@routes/auth-router';
import { pErr } from '@shared/functions';
import { pwdSaltRounds } from 'spec/support/login-agent';
import { UnauthorizedError } from '@shared/errors';


// **** Variables **** //

// Misc
const authPath = '/api/auth',
  loginPath = `${authPath}${paths.login}`,
  logoutPath = `${authPath}${paths.logout}`,
  { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;

// Test message
const msgs = {
  goodLogin: `should return a response with a status of ${OK} and a cookie with a jwt if the login
    was successful.`,
  emailNotFound: `should return a response with a status of ${UNAUTHORIZED} and a json with the 
    "error ${UnauthorizedError.Msg}" if the email was not found.`,
  pwdFailed: `should return a response with a status of ${UNAUTHORIZED} and a json with the error
    "${UnauthorizedError.Msg}" if the password failed.`,
  fallbackErr: `should return a response with a status of ${BAD_REQUEST} and a json with an error
    for all other bad responses.`,
  goodLogout: `should return a response with a status of ${OK}.`,
}


// **** Types **** //

type TReqBody = string | object | undefined;


// **** Tests **** //

describe('auth-router', () => {

  let agent: SuperTest<Test>;

  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  // Test login
  describe(`"POST:${loginPath}"`, () => {

    const callApi = (reqBody: TReqBody) => {
      return agent.post(loginPath).type('form').send(reqBody);
    };

    // Good login
    it(msgs.goodLogin, (done) => {
      // Setup Dummy Data
      const creds = {
        email: 'jsmith@gmail.com',
        password: 'Password@1',
      };
      const role = UserRoles.Standard;
      const pwdHash = hashPwd(creds.password);
      const loginUser = User.new('john smith', creds.email, role, pwdHash);
      spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
      // Call API
      callApi(creds)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          expect(res.headers['set-cookie'][0]).toContain(envVars.cookieProps.key);
          done();
        });
    });

    // Email not found error
    it(msgs.emailNotFound, (done) => {
      // Setup Dummy Data
      const creds = {
        email: 'jsmith@gmail.com',
        password: 'Password@1',
      };
      spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(null));
      // Call API
      callApi(creds)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(UNAUTHORIZED);
          expect(res.body.error).toBe(UnauthorizedError.Msg);
          done();
        });
    });

    // Password failed
    it(msgs.pwdFailed, (done) => {
      // Setup Dummy Data
      const creds = {
        email: 'jsmith@gmail.com',
        password: 'someBadPassword',
      };
      const role = UserRoles.Standard;
      const pwdHash = hashPwd('Password@1');
      const loginUser = User.new('john smith', creds.email, role, pwdHash);
      spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
      // Call API
      callApi(creds)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(UNAUTHORIZED);
          expect(res.body.error).toBe(UnauthorizedError.Msg);
          done();
        });
    });

    // Fallback error
    it(msgs.fallbackErr, (done) => {
      // Setup Dummy Data
      const creds = {
        email: 'jsmith@gmail.com',
        password: 'someBadPassword',
      };
      spyOn(userRepo, 'getOne').and.throwError('Database query failed.');
      // Call API
      callApi(creds)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBeTruthy();
          done();
        });
    });
  });

  // Test logout
  describe(`"GET:${logoutPath}"`, () => {

    it(msgs.goodLogout, (done) => {
      agent.get(logoutPath)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          done();
        });
    });
  });
});


// **** Helper functions **** //

function hashPwd(pwd: string) {
  return bcrypt.hashSync(pwd, pwdSaltRounds);
}
