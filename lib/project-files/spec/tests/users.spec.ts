import supertest from 'supertest';
import insertUrlParams from 'inserturlparams';
import { parseJson } from 'jet-validators/utils';

import app from '@src/server';

import UserRepo from '@src/repos/UserRepo';
import User from '@src/models/User';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { ValidationErr } from '@src/common/route-errors';

import Paths from 'spec/support/Paths';
import { cleanDatabase, IValidationErr, parseResBody } from 'spec/support';


/******************************************************************************
                               Variables
******************************************************************************/

// Dummy users for GET req
const DB_USERS = [
  User.new({ id: 1, name: 'Sean Maxwell', email: 'sean.maxwell@gmail.com' }),
  User.new({ id: 2, name: 'John Smith', email: 'john.smith@gmail.com' }),
  User.new({ id: 3, name: 'Gordan Freeman', email: 'gordan.freeman@gmail.com' }),
] as const;


/******************************************************************************
                                 Tests
******************************************************************************/

describe('UserRouter', () => {

  const agent = supertest.agent(app);

  // Run before all tests
  beforeEach(async () => {
    await cleanDatabase();
    await UserRepo.insertMult(DB_USERS);
  });

  // Get all users
  describe(`"GET:${Paths.Users.Get}"`, () => {

    // Success
    it('should return a JSON object with all the users and a status code ' + 
    `of "${HttpStatusCodes.OK}" if the request was successful.`, done => {
      agent
        .get(Paths.Users.Get)
        .end((_, res) => {
          parseResBody(res.body);
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body).toEqual({ users: DB_USERS });
          done();
        });
    });
  });

  // Test add user
  describe(`"POST:${Paths.Users.Add}"`, () => {

    // Test add user success
    it(`should return a status code of "${HttpStatusCodes.CREATED}" if the ` + 
    'request was successful.', done => {
      const user = User.new({ name: 'a', email: 'a@a.com' });
      agent
        .post(Paths.Users.Add)
        .send({ user })
        .end((_, res) => {
          expect(res.status).toBe(HttpStatusCodes.CREATED);
          done();
        });
    });

    // Missing param
    it('should return a JSON object with an error message of and a status ' + 
      `code of "${HttpStatusCodes.BAD_REQUEST}" if the user param was ` + 
      'missing.', done => {
      agent
        .post(Paths.Users.Add)
        .send({ user: null })
        .end((_, res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          const errorObj = parseJson<IValidationErr>(res.body.error);
          expect(errorObj.message).toBe(ValidationErr.MSG);
          expect(errorObj.parameters[0].prop).toBe('user');
          done();
        });
    });
  });

  // Update users
  describe(`"PUT:${Paths.Users.Update}"`, () => {

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', done => {
      const user = DB_USERS[0];
      user.name = 'Bill';
      agent
        .put(Paths.Users.Update)
        .send({ user })
        .end((_, res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
    });

    // Param missing
    it('should return a JSON object with an error message and a status code ' +
    `of "${HttpStatusCodes.BAD_REQUEST}" if the user param was missing`,
    done => {
      agent
        .put(Paths.Users.Update)
        .send({ user: null })
        .end((_, res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          const errorObj = parseJson<IValidationErr>(res.body.error);
          expect(errorObj.message).toBe(ValidationErr.MSG);
          expect(errorObj.parameters[0].prop).toBe('user');
          done();
        });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, done => {
      const user = User.new({ id: 4, name: 'a', email: 'a@a.com' });
      agent
        .put(Paths.Users.Update)
        .send({ user })
        .end((_, res) => {
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
          done();
        });
    });
  });

  // Delete User
  describe(`"DELETE:${Paths.Users.Delete}"`, () => {

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', done => {
      agent
        .delete(insertUrlParams(Paths.Users.Delete, { id: 3 }))
        .end((_, res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, done => {
      agent
        .delete(insertUrlParams(Paths.Users.Delete, { id: -1 }))
        .end((_, res) => {
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
          done();
        });
    });
  });
});
