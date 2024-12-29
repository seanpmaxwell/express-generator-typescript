import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import insertUrlParams from 'inserturlparams';
import { parseJson } from 'jet-validators/utils';
import logger from 'jet-logger';

import app from '@src/server';

import UserRepo from '@src/repos/UserRepo';
import User, { IUser } from '@src/models/User';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { IValidationErrFormat, ValidationErr } from '@src/common/route-errors';

import Paths from 'spec/support/Paths';
import { convertValidDates } from 'spec/support';
import { TApiCb, TRes } from 'spec/types/misc';


/******************************************************************************
                               Setup
******************************************************************************/

// Dummy users for GET req
const getDummyUsers = () => [
  User.new({ name: 'Sean Maxwell', email: 'sean.maxwell@gmail.com' }),
  User.new({ name: 'John Smith', email: 'john.smith@gmail.com' }),
  User.new({ name: 'Gordan Freeman', email: 'gordan.freeman@gmail.com' }),
];

// Convert "created" prop back to Date object
const createdKeyToDate = convertValidDates('created');

// Setup wrap-callback function
const wrapCb = (cb: TApiCb) => (err: Error, res: TRes) => {
  if (!!err) {
    logger.err(err);
  }
  createdKeyToDate(res.body);
  return cb(res);
};


/******************************************************************************
                                 Tests
******************************************************************************/

describe('UserRouter', () => {

  let agent: TestAgent<Test>;

  // Run before all tests
  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });

  // Get all users
  describe(`"GET:${Paths.Users.Get}"`, () => {

    // Setup API
    const api = (cb: TApiCb) => 
      agent
        .get(Paths.Users.Get)
        .end(wrapCb(cb));

    // Success
    it('should return a JSON object with all the users and a status code ' + 
    `of "${HttpStatusCodes.OK}" if the request was successful.`, done => {
      // Add spy
      const data = getDummyUsers();
      spyOn(UserRepo, 'getAll').and.resolveTo(data);
      // Call API
      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body).toEqual({ users: data });
        done();
      });
    });
  });

  // Test add user
  describe(`"POST:${Paths.Users.Add}"`, () => {

    const DUMMY_USER = getDummyUsers()[0];

    // Setup API
    const callApi = (user: IUser | null, cb: TApiCb) => 
      agent
        .post(Paths.Users.Add)
        .send({ user })
        .end(wrapCb(cb));

    // Test add user success
    it(`should return a status code of "${HttpStatusCodes.CREATED}" if the ` + 
    'request was successful.', done => {
      // Spy
      spyOn(UserRepo, 'add').and.resolveTo();
      // Call api
      callApi(DUMMY_USER, res => {
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        done();
      });
    });

    // Missing param
    it('should return a JSON object with an error message of and a status ' + 
      `code of "${HttpStatusCodes.BAD_REQUEST}" if the user param was ` + 
      'missing.', done => {
      // Call api
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        const errorObj = parseJson<IValidationErrFormat>(res.body.error);
        expect(errorObj.error).toBe(ValidationErr.MSG);
        expect(errorObj.parameter).toBe('user');
        done();
      });
    });
  });

  // Update users
  describe(`"PUT:${Paths.Users.Update}"`, () => {

    const DUMMY_USER = getDummyUsers()[0];

    // Setup API
    const callApi = (user: IUser | null, cb: TApiCb) => 
      agent
        .put(Paths.Users.Update)
        .send({ user })
        .end(wrapCb(cb));

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', done => {
      spyOn(UserRepo, 'update').and.resolveTo();
      spyOn(UserRepo, 'persists').and.resolveTo(true);
      callApi(DUMMY_USER, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    // Param missing
    it('should return a JSON object with an error message and a status code ' +
    `of "${HttpStatusCodes.BAD_REQUEST}" if the user param was missing`,
    done => {
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        const errorObj = parseJson<IValidationErrFormat>(res.body.error);
        expect(errorObj.error).toBe(ValidationErr.MSG);
        expect(errorObj.parameter).toBe('user');
        done();
      });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, done => {
      callApi(DUMMY_USER, res => {
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
        done();
      });
    });
  });

  // Delete User
  describe(`"DELETE:${Paths.Users.Delete}"`, () => {

    // Call API
    const callApi = (id: number, cb: TApiCb) => 
      agent
        .delete(insertUrlParams(Paths.Users.Delete, { id }))
        .end(wrapCb(cb));

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', done => {
      spyOn(UserRepo, 'delete').and.resolveTo();
      spyOn(UserRepo, 'persists').and.resolveTo(true);
      callApi(5, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, done => {
      callApi(-1, res => {
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
        done();
      });
    });
  });
});
