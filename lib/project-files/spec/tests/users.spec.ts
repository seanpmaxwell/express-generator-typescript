import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { defaultErrMsg as ValidatorErr } from 'jet-validator';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import UserRepo from '@src/repos/UserRepo';
import User, { IUser } from '@src/models/User';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';

import Paths from 'spec/support/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';


// Dummy users for GET req
const getDummyUsers = () => {
  return [
    User.new('Sean Maxwell', 'sean.maxwell@gmail.com'),
    User.new('John Smith', 'john.smith@gmail.com'),
    User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
  ];
};


// Tests
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
        .end(apiCb(cb));

    // Success
    it('should return a JSON object with all the users and a status code ' + 
    `of "${HttpStatusCodes.OK}" if the request was successful.`, (done) => {
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

    const ERROR_MSG = `${ValidatorErr}"user".`,
      DUMMY_USER = getDummyUsers()[0];

    // Setup API
    const callApi = (user: IUser | null, cb: TApiCb) => 
      agent
        .post(Paths.Users.Add)
        .send({ user })
        .end(apiCb(cb));

    // Test add user success
    it(`should return a status code of "${HttpStatusCodes.CREATED}" if the ` + 
    'request was successful.', (done) => {
      // Spy
      spyOn(UserRepo, 'add').and.resolveTo();
      // Call api
      callApi(DUMMY_USER, res => {
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        done();
      });
    });

    // Missing param
    it(`should return a JSON object with an error message of "${ERROR_MSG}" ` + 
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the user ` + 
    'param was missing.', (done) => {
      // Call api
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(ERROR_MSG);
        done();
      });
    });
  });

  // Update users
  describe(`"PUT:${Paths.Users.Update}"`, () => {

    const ERROR_MSG = `${ValidatorErr}"user".`,
      DUMMY_USER = getDummyUsers()[0];

    // Setup API
    const callApi = (user: IUser | null, cb: TApiCb) => 
      agent
        .put(Paths.Users.Update)
        .send({ user })
        .end(apiCb(cb));

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', (done) => {
      // Setup spies
      spyOn(UserRepo, 'update').and.resolveTo();
      spyOn(UserRepo, 'persists').and.resolveTo(true);
      // Call api
      callApi(DUMMY_USER, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    // Param missing
    it(`should return a JSON object with an error message of "${ERROR_MSG}" ` +
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the user ` + 
    'param was missing.', (done) => {
      // Call api
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(ERROR_MSG);
        done();
      });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
      // Call api
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
        .end(apiCb(cb));

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', (done) => {
      // Setup spies
      spyOn(UserRepo, 'delete').and.resolveTo();
      spyOn(UserRepo, 'persists').and.resolveTo(true);
      // Call api
      callApi(5, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, done => {
      // Setup spies
      callApi(-1, res => {
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
        done();
      });
    });
  });
});
