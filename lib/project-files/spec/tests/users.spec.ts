import supertest, { SuperTest, Test, Response } from 'supertest';
import { defaultErrMsg } from 'jet-validator';
import logger from 'jet-logger';

import app from '@src/server';
import userRepo from '@src/repos/user-repo';
import User, { IUser } from '@src/models/User';
import userRoutes from '@src/routes/user-routes';
import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';
import loginAgent from '../support/login-agent';
import { userNotFoundErr } from '@src/services/user-service';


// **** Variables **** //

// Misc
const { paths } = userRoutes,
  usersPath = ('/api' + paths.basePath),
  getUsersPath = `${usersPath}${paths.get}`,
  addUsersPath = `${usersPath}${paths.add}`,
  updateUserPath = `${usersPath}${paths.update}`,
  deleteUserPath = `${usersPath}${paths.delete}`;

// Dummy users for GET req
const dummyGetAllUsers = [
  User.new('Sean Maxwell', 'sean.maxwell@gmail.com'),
  User.new('John Smith', 'john.smith@gmail.com'),
  User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
] as const;

// Dummy update user
const dummyUserData = {
  user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
} as const;

// Test messages
const msgs = {
  getUsersSuccess: 'should return a JSON object with all the users and a ' +
    `status code of "${HttpStatusCodes.OK}" if the request was successful.`,
  getUsersBad: 'should return a JSON object containing an error message ' +
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the request ` + 
    'was unsuccessful.',
  addUserSuccess: 'should return a status code of ' + 
    `"${HttpStatusCodes.CREATED}" if the request was successful.`,
  addUserFailedMissingParam: 'should return a JSON object with an error ' +
    `message of "${defaultErrMsg}" and a status code of ` +
    `"${HttpStatusCodes.BAD_REQUEST}" if the user param was missing.`,
  addUserFallbackErr: 'should return a JSON object with an error message ' + 
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the request ` + 
    'was unsuccessful.',
  updateSuccess: `should return a status code of "${HttpStatusCodes.OK}" if ` + 
    'the request was successful.',
  updateParamMissing: 'should return a JSON object with an error message ' +
    `of "${defaultErrMsg}" and a status code of ` + 
    `"${HttpStatusCodes.BAD_REQUEST}" if the user param was missing.`,
  updateUserNotFound: 'should return a JSON object with the error message ' +
    `of "${userNotFoundErr}" and a status code of ` +
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`,
  updateFallbackErr: 'should return a JSON object with an error message ' +
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the request ` + 
    'was unsuccessful.',
  deleteSuccessful: `should return a status code of "${HttpStatusCodes.OK}" ` + 
    'if the request was successful.',
  deleteUserNotFound: 'should return a JSON object with the error message ' +
    `of "${userNotFoundErr}" and a status code of ` +
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`,
  deleteFallbackErr: 'should return a JSON object with an error message ' +
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the request ` + 
    'was unsuccessful.',
} as const;


// **** Types **** //

type TReqBody = string | object | undefined;


// **** Tests **** //

describe('user-router', () => {

  let agent: SuperTest<Test>;
  let jwtCookie: string;


  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    loginAgent.login(agent, (cookie: string) => {
      jwtCookie = cookie;
      done();
    });
  });

  // Test get users
  describe(`"GET:${getUsersPath}"`, () => {

    const callApi = () => 
      agent.get(getUsersPath)
        .set('Cookie', jwtCookie);

    // Get all users
    it(msgs.getUsersSuccess, (done) => {
      const ret = Promise.resolve([...dummyGetAllUsers]);
      spyOn(userRepo, 'getAll').and.returnValue(ret);
      // Call API
      callApi().end((err: Error, res: Response) => {
        !!err && logger.err(err);
        expect(res.status).toBe(HttpStatusCodes.OK);
        // Caste instance-objects to 'User' objects
        const respUsers = res.body.users;
        const retUsers = respUsers.map((user: IUser) => User.copy(user));
        expect(retUsers).toEqual(dummyGetAllUsers);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });

    // Get all users bad
    it(msgs.getUsersBad, (done) => {
      const errMsg = 'Could not fetch users.';
      spyOn(userRepo, 'getAll').and.throwError(errMsg);
      // Call API
      callApi()
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(errMsg);
          done();
        });
    });
  });

  // Test add user
  describe(`"POST:${addUsersPath}"`, () => {

    // Consts
    const callApi = (reqBody: TReqBody) => {
      return agent.post(addUsersPath)
        .set('Cookie', jwtCookie)
        .type('form').send(reqBody);
    };

    // Test add user success
    it(msgs.addUserSuccess, (done) => {
      spyOn(userRepo, 'add').and.returnValue(Promise.resolve());
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.CREATED);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    // Test add user failed due to missing param
    it(msgs.addUserFailedMissingParam, (done) => {
      callApi({})
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(defaultErrMsg);
          done();
        });
    });

    // Default error
    it(msgs.addUserFallbackErr, (done) => {
      const errMsg = 'Could not add user.';
      spyOn(userRepo, 'add').and.throwError(errMsg);
      // Call API
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(errMsg);
          done();
        });
    });
  });

  // Test update users
  describe(`"PUT:${updateUserPath}"`, () => {

    const callApi = (reqBody: TReqBody) => 
      agent.put(updateUserPath)
        .set('Cookie', jwtCookie)
        .type('form').send(reqBody);

    // Test updating a user success
    it(msgs.updateSuccess, (done) => {
      spyOn(userRepo, 'update').and.returnValue(Promise.resolve());
      spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
      // Call api
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    // Test updating a user failed because a param was missing
    it(msgs.updateParamMissing, (done) => {
      callApi({})
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(defaultErrMsg);
          done();
        });
    });

    // Update user not found
    it(msgs.updateUserNotFound, (done) => {
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          expect(res.body.error).toBe(userNotFoundErr);
          done();
        });
    });

    // Update fallback error
    it(msgs.updateFallbackErr, (done) => {
      const updateErrMsg = 'Could not update user.';
      spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
      spyOn(userRepo, 'update').and.throwError(updateErrMsg);
      // Call API
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(updateErrMsg);
          done();
        });
    });
  });

  // Test delete user
  describe(`"DELETE:${deleteUserPath}"`, () => {

    const callApi = (id: number) => {
      const path = deleteUserPath.replace(':id', id.toString());
      return agent.delete(path)
        .set('Cookie', jwtCookie);
    };

    // Delete user successful
    it(msgs.deleteSuccessful, (done) => {
      spyOn(userRepo, 'delete').and.returnValue(Promise.resolve());
      spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
      // Call api
      callApi(5)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    // Delete, user not found error
    it(msgs.deleteUserNotFound, (done) => {
      callApi(-1)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          expect(res.body.error).toBe(userNotFoundErr);
          done();
        });
    });

    // Delete, not a valid number error
    it(msgs.deleteUserNotFound, (done) => {
      callApi('horse' as unknown as number)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(defaultErrMsg);
          done();
        });
    });

    // Delete user fallback error
    it(msgs.deleteFallbackErr, (done) => {
      spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
      const deleteErrMsg = 'Could not delete user.';
      spyOn(userRepo, 'delete').and.throwError(deleteErrMsg);
      // Call API
      callApi(1)
        .end((err: Error, res: Response) => {
          !!err && logger.err(err);
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(deleteErrMsg);
          done();
        });
    });
  });
});
