import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import userRepo from '@repos/user-repo';
import User, { IUser } from '@models/user-model';
import { pErr } from '@shared/functions';
import { p as userPaths } from '@routes/user-router';
import { ParamMissingError, UserNotFoundError } from '@shared/errors';


// **** Variables **** //

// Misc
const usersPath = '/api/users',
  getUsersPath = `${usersPath}${userPaths.get}`,
  addUsersPath = `${usersPath}${userPaths.add}`,
  updateUserPath = `${usersPath}${userPaths.update}`,
  deleteUserPath = `${usersPath}${userPaths.delete}`,
  { BAD_REQUEST, CREATED, OK } = StatusCodes;

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
  getUsersSuccess: `should return a JSON object with all the users and a status code of 
    "${OK}" if the request was successful.`,
  getUsersBad: `should return a JSON object containing an error message and a status code of
    "${BAD_REQUEST}" if the request was unsuccessful.`,
  addUserSuccess: `should return a status code of "${CREATED}" if the request was successful.`,
  addUserFailedMissingParam: `should return a JSON object with an error message of 
    "${ParamMissingError.Msg}" and a status code of "${BAD_REQUEST}" if the user param was 
    missing.`,
  addUserFallbackErr: `should return a JSON object with an error message and a status code 
    of "${BAD_REQUEST}" if the request was unsuccessful.`,
  updateSuccess: `should return a status code of "${OK}" if the request was successful.`,
  updateParamMissing: `should return a JSON object with an error message of 
    "${ParamMissingError.Msg}" and a status code of "${BAD_REQUEST}" if the user param was 
    missing.`,
  updateUserNotFound: `should return a JSON object with the error message of 
    ${UserNotFoundError.Msg} and a status code of "${UserNotFoundError.HttpStatus}" if the id 
    was not found.`,
  updateFallbackErr: `should return a JSON object with an error message and a status code of 
    "${BAD_REQUEST}" if the request was unsuccessful.`,
  deleteSuccessful: `should return a status code of "${OK}" if the request was successful.`,
  deleteUserNotFound: `should return a JSON object with the error message of 
    ${UserNotFoundError.Msg} and a status code of "${UserNotFoundError.HttpStatus}" if the id was 
    not found.`,
  deleteFallbackErr: `should return a JSON object with an error message and a status code of 
    "${BAD_REQUEST}" if the request was unsuccessful.`,
};


// **** Types **** //

type TReqBody = string | object | undefined;


// **** Tests **** //

describe('user-router', () => {

  let agent: SuperTest<Test>;


  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  // Test get users 
  describe(`"GET:${getUsersPath}"`, () => {

    // Get all users
    it(msgs.getUsersSuccess, (done) => {
      const ret = Promise.resolve([...dummyGetAllUsers]);
      spyOn(userRepo, 'getAll').and.returnValue(ret);
      // Call API
      agent.get(getUsersPath)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          // Caste instance-objects to 'User' objects
          const respUsers = res.body.users;
          const retUsers: IUser[] = respUsers.map((user: IUser) => User.copy(user));
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
      agent.get(getUsersPath)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(errMsg);
          done();
        });
    });
  });

  // Test add user
  describe(`"POST:${addUsersPath}"`, () => {

    const callApi = (reqBody: TReqBody) => {
      return agent
        .post(addUsersPath)
        .type('form').send(reqBody);
    };

    // Test add user success
    it(msgs.addUserSuccess, (done) => {
      spyOn(userRepo, 'add').and.returnValue(Promise.resolve());
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(CREATED);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    // Test add user failed due to missing param
    it(msgs.addUserFailedMissingParam, (done) => {
      callApi({})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(ParamMissingError.Msg);
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
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(errMsg);
          done();
        });
    });
  });

  // Test update users
  describe(`"PUT:${updateUserPath}"`, () => {

    const callApi = (reqBody: TReqBody) => {
      return agent.put(updateUserPath)
        .type('form')
        .send(reqBody);
    };

    // Test updating a user success
    it(msgs.updateSuccess, (done) => {
      spyOn(userRepo, 'update').and.returnValue(Promise.resolve());
      spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
      // Call api
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    // Test updating a user failed because a param was missing
    it(msgs.updateParamMissing, (done) => {
      callApi({})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(ParamMissingError.Msg);
          done();
        });
    });

    // Update user not found
    it(msgs.updateUserNotFound, (done) => {
      callApi(dummyUserData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(UserNotFoundError.HttpStatus);
          expect(res.body.error).toBe(UserNotFoundError.Msg);
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
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(updateErrMsg);
          done();
        });
    });
  });

  // Test delete user
  describe(`"DELETE:${deleteUserPath}"`, () => {

    const callApi = (id: number) => {
      const path = deleteUserPath.replace(':id', id.toString());
      return agent.delete(path);
    };

    // Delete user successful
    it(msgs.deleteSuccessful, (done) => {
      spyOn(userRepo, 'delete').and.returnValue(Promise.resolve());
      spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
      // Call api
      callApi(5)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    // Delete, user not found error
    it(msgs.deleteUserNotFound, (done) => {
      callApi(-1)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(UserNotFoundError.HttpStatus);
          expect(res.body.error).toBe(UserNotFoundError.Msg);
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
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(deleteErrMsg);
          done();
        });
    });
  });
});
