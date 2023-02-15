import supertest, { SuperTest, Test, Response } from 'supertest';
import { defaultErrMsg as ValidatorErr } from 'jet-validator';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import UserRepo from '@src/repos/UserRepo';
import User from '@src/models/User';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';
import FullPaths from '@src/routes/constants/FullPaths';

import login from '../support/login';
import { TReqBody } from 'spec/support/types';


// **** Variables **** //

// Paths
const {
  Get,
  Add,
  Update,
  Delete,
} = FullPaths.Users;

// StatusCodes
const {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
} = HttpStatusCodes;

// Dummy users for GET req
const DummyGetAllUsers = [
  new User('Sean Maxwell', 'sean.maxwell@gmail.com'),
  new User('John Smith', 'john.smith@gmail.com'),
  new User('Gordan Freeman', 'gordan.freeman@gmail.com'),
] as const;

// Dummy update user
const DummyUserData = {
  user: new User('Gordan Freeman', 'gordan.freeman@gmail.com'),
} as const;


// **** Tests **** //

describe('UserRouter', () => {

  let agent: SuperTest<Test>,
    jwtCookie: string;

  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    login(agent, (cookie: string) => {
      jwtCookie = cookie;
      done();
    });
  });

  // ** Get all users ** //
  describe(`"GET:${Get}"`, () => {

    const callApi = () => 
      agent
        .get(Get)
        .set('Cookie', jwtCookie);

    // Success
    it('should return a JSON object with all the users and a status code ' + 
    `of "${OK}" if the request was successful.`, (done) => {
      // Add spy
      spyOn(UserRepo, 'getAll').and.resolveTo([...DummyGetAllUsers]);
      // Call API
      callApi()
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(OK);
          for (let i = 0; i < res.body.users.length; i++) {
            const user = User.from(res.body.users[i]);
            expect(user).toEqual(DummyGetAllUsers[i]);
          }
          done();
        });
    });
  });

  // Test add user
  describe(`"POST:${Add}"`, () => {

    const callApi = (reqBody: TReqBody) => 
      agent
        .post(Add)
        .set('Cookie', jwtCookie)
        .type('form').send(reqBody);

    // Test add user success
    it(`should return a status code of "${CREATED}" if the request was ` + 
    'successful.', (done) => {
      // Spy
      spyOn(UserRepo, 'add').and.resolveTo();
      // Call api
      callApi(DummyUserData)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(CREATED);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    // Missing param
    it('should return a JSON object with an error message of ' + 
    `"${ValidatorErr}" and a status code of "${BAD_REQUEST}" if the user ` + 
    'param was missing.', (done) => {
      // Call api
      callApi({})
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(ValidatorErr);
          done();
        });
    });
  });

  // ** Update users ** //
  describe(`"PUT:${Update}"`, () => {

    const callApi = (reqBody: TReqBody) => 
      agent
        .put(Update)
        .set('Cookie', jwtCookie)
        .type('form').send(reqBody);

    // Success
    it(`should return a status code of "${OK}" if the request was successful.`, 
      (done) => {
        // Setup spies
        spyOn(UserRepo, 'update').and.resolveTo();
        spyOn(UserRepo, 'persists').and.resolveTo(true);
        // Call api
        callApi(DummyUserData)
          .end((_: Error, res: Response) => {
            expect(res.status).toBe(OK);
            expect(res.body.error).toBeUndefined();
            done();
          });
      });

    // Param missing
    it('should return a JSON object with an error message of ' +
    `"${ValidatorErr}" and a status code of "${BAD_REQUEST}" if the user ` + 
    'param was missing.', (done) => {
      // Call api
      callApi({})
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(ValidatorErr);
          done();
        });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of "${NOT_FOUND}" if the id ` + 
    'was not found.', (done) => {
      // Call api
      callApi(DummyUserData)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(NOT_FOUND);
          expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
          done();
        });
    });
  });

  // ** Delete user ** //
  describe(`"DELETE:${Delete}"`, () => {

    const callApi = (id: number) => 
      agent
        .delete(insertUrlParams(Delete, { id }))
        .set('Cookie', jwtCookie);

    // Success
    it(`should return a status code of "${OK}" if the request was successful.`, 
      (done) => {
        // Setup spies
        spyOn(UserRepo, 'delete').and.resolveTo();
        spyOn(UserRepo, 'persists').and.resolveTo(true);
        // Call api
        callApi(5)
          .end((_: Error, res: Response) => {
            expect(res.status).toBe(OK);
            expect(res.body.error).toBeUndefined();
            done();
          });
      });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of "${NOT_FOUND}" if the id ` + 
    'was not found.', (done) => {
      callApi(-1)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(NOT_FOUND);
          expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
          done();
        });
    });

    // Invalid param
    it(`should return a status code of "${BAD_REQUEST}" and return an error ` + 
    `message of "${ValidatorErr}" if the id was not a valid number`, (done) => {
      callApi('horse' as unknown as number)
        .end((_: Error, res: Response) => {
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toBe(ValidatorErr);
          done();
        });
    });
  });
});
