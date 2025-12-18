import UserRepo from '@src/repos/UserRepo';
import User, { IUser } from '@src/models/User';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';

import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import { ValidationError } from '@src/common/util/route-errors';
import { JET_PATHS as Paths }  from '@src/common/constants/PATHS';

import { compareUserArrays, parseValidationError } from './common/utils';
import { agent } from './aux/setup';
import { TRes } from './common/types';

/******************************************************************************
                               Constants
******************************************************************************/

// Dummy users for GET req
const DB_USERS = [
  User.new({ name: 'Sean Maxwell', email: 'sean.maxwell@gmail.com' }),
  User.new({ name: 'John Smith', email: 'john.smith@gmail.com' }),
  User.new({ name: 'Gordan Freeman', email: 'gordan.freeman@gmail.com' }),
] as const;

/******************************************************************************
                                 Tests
  IMPORTANT: Following TypeScript best practices, we test all scenarios that 
  can be triggered by a user under normal circumstances. Not all theoretically
  scenarios (i.e. a failed database connection). 
******************************************************************************/

describe('UserRouter', () => {

  let dbUsers: IUser[] = [];

  // Run before all tests
  beforeEach(async () => {
    await UserRepo.deleteAllUsers();
    dbUsers = await UserRepo.insertMult(DB_USERS);
  });

  // Get all users
  describe(`"GET:${Paths.Users.Get}"`, () => {

    // Success
    it('should return a JSON object with all the users and a status code ' + 
    `of "${HTTP_STATUS_CODES.Ok}" if the request was successful.`, async () => {
      const res: TRes<{ users: IUser[]}> = await agent.get(Paths.Users.Get);
      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);
      expect(compareUserArrays(res.body.users, DB_USERS)).toBeTruthy();
    });
  });

  // Test add user
  describe(`"POST:${Paths.Users.Add}"`, () => {

    // Test add user success
    it(`should return a status code of "${HTTP_STATUS_CODES.Created}" if ` + 
    'the request was successful.', async () => {
      const user = User.new({ name: 'a', email: 'a@a.com' }),
        res = await agent.post(Paths.Users.Add).send({ user });
      expect(res.status).toBe(HTTP_STATUS_CODES.Created);
    });

    // Missing param
    it('should return a JSON object with an error message of and a status ' + 
      `code of "${HTTP_STATUS_CODES.BadRequest}" if the user param was ` + 
      'missing.', async () => {
      const res: TRes = await agent.post(Paths.Users.Add).send({ user: null });
      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
      const errorObj = parseValidationError(res.body.error);
      expect(errorObj.message).toBe(ValidationError.MESSAGE);
      expect(errorObj.errors[0].prop).toBe('user');
    });
  });

  // Update users
  describe(`"PUT:${Paths.Users.Update}"`, () => {

    // Success
    it(`should return a status code of "${HTTP_STATUS_CODES.Ok}" if the ` + 
    'request was successful.', async () => {
      const user = DB_USERS[0];
      user.name = 'Bill';
      const res = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);
    });

    // Id is the wrong data type
    it('should return a JSON object with an error message and a status code ' +
    `of "${HTTP_STATUS_CODES.BadRequest}" if the user param was missing`, 
    async () => {
      const user = User.new();
      user.id = ('5' as unknown as number);
      const res: TRes = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(HTTP_STATUS_CODES.BadRequest);
      const errorObj = parseValidationError(res.body.error);
      expect(errorObj.message).toBe(ValidationError.MESSAGE);
      expect(errorObj.errors[0].prop).toBe('user');
      expect(errorObj.errors[0].children?.[0].prop).toBe('id');
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HTTP_STATUS_CODES.NotFound}" if the id was not found.`, async () => {
      const user = User.new({ id: 4, name: 'a', email: 'a@a.com' }),
        res: TRes = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(HTTP_STATUS_CODES.NotFound);
      expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
    });
  });

  // Delete User
  describe(`"DELETE:${Paths.Users.Delete()}"`, () => {

    // Success
    it(`should return a status code of "${HTTP_STATUS_CODES.Ok}" if the ` + 
    'request was successful.', async () => {
      const id = dbUsers[0].id,
        res = await agent.delete(Paths.Users.Delete(id));
      expect(res.status).toBe(HTTP_STATUS_CODES.Ok);
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HTTP_STATUS_CODES.NotFound}" if the id was not found.`, async () => {
      const res: TRes = await agent.delete(Paths.Users.Delete(-1));
      expect(res.status).toBe(HTTP_STATUS_CODES.NotFound);
      expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
    });
  });
});
