import supertest, { SuperTest, Test, Response } from 'supertest';
import logger from 'jet-logger';

import app from '@src/server';
import authRoutes from '@src/routes/auth-routes';
import userRepo from '@src/repos/user-repo';
import pwdUtil from '@src/util/pwd-util';
import EnvVars from '@src/declarations/major/EnvVars';
import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';
import User, { UserRoles } from '@src/models/User';
import { errors as authServiceErrs } from '@src/services/auth-service';


// **** Variables **** //

// Misc
const { paths } = authRoutes,
  authPath = ('/api' + paths.basePath),
  loginPath = `${authPath}${paths.login}`,
  logoutPath = `${authPath}${paths.logout}`;

// Test message
const msgs = {
  goodLogin: 'should return a response with a status of ' + 
    `"${HttpStatusCodes.OK}" and a cookie with a jwt if the login was ` + 
    'successful.',
  emailNotFound: 'should return a response with a status of ' + 
    `"${HttpStatusCodes.UNAUTHORIZED}" and a json with an error message if ` + 
    'the email was not found.',
  pwdFailed: 'should return a response with a status of ' + 
    `"${HttpStatusCodes.UNAUTHORIZED}" and a json with the error ` + 
    `"${authServiceErrs.unauth}" if the password failed.`,
  fallbackErr: 'should return a response with a status of ' + 
    `"${HttpStatusCodes.BAD_REQUEST}" and a json with an error for all ` + 
    'other bad responses.',
  goodLogout: `should return a response with a status of ${HttpStatusCodes.OK}`,
} as const;

// Login credentials
const loginCreds = {
  email: 'jsmith@gmail.com',
  password: 'Password@1',
} as const;


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
      const role = UserRoles.Standard;
      const pwdHash = pwdUtil.hashSync(loginCreds.password);
      const loginUser = User.new('john smith', loginCreds.email, role, pwdHash);
      spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
      // Call API
      callApi(loginCreds)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.OK);
          const cookie = res.headers['set-cookie'][0];
          expect(cookie).toContain(EnvVars.cookieProps.key);
          done();
        });
    });

    // Email not found error
    it(msgs.emailNotFound, (done) => {
      spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(null));
      callApi(loginCreds)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
          const errMsg = authServiceErrs.emailNotFound(loginCreds.email);
          expect(res.body.error).toBe(errMsg);
          done();
        });
    });

    // Password failed
    it(msgs.pwdFailed, (done) => {
      const role = UserRoles.Standard;
      const pwdHash = pwdUtil.hashSync('bad password');
      const loginUser = User.new('john smith', loginCreds.email, role, pwdHash);
      spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
      // Call API
      callApi(loginCreds)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
          expect(res.body.error).toBe(authServiceErrs.unauth);
          done();
        });
    });

    // Fallback error
    it(msgs.fallbackErr, (done) => {
      spyOn(userRepo, 'getOne').and.throwError('Database query failed.');
      callApi(loginCreds)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBeTruthy();
          done();
        });
    });
  });

  // Test logout
  describe(`"GET:${logoutPath}"`, () => {

    // Successful logout
    it(msgs.goodLogout, (done) => {
      agent.get(logoutPath)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
    });
  });
});
