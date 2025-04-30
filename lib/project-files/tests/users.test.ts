import insertUrlParams from 'inserturlparams';
import { customDeepCompare } from 'jet-validators/utils';

import UserRepo from '@src/repos/UserRepo';
import User, { IUser } from '@src/models/User';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { ValidationError } from '@src/common/util/route-errors';

import Paths from './common/Paths';
import { parseValidationErr, TRes } from './common/util';
import { agent } from './support/setup';


/******************************************************************************
                               Constants
******************************************************************************/

// Dummy users for GET req
const DB_USERS = [
  User.new({ name: 'Sean Maxwell', email: 'sean.maxwell@gmail.com' }),
  User.new({ name: 'John Smith', email: 'john.smith@gmail.com' }),
  User.new({ name: 'Gordan Freeman', email: 'gordan.freeman@gmail.com' }),
] as const;

// Don't compare "id" and "created" cause those are set dynamically by the 
// database
const compareUserArrays = customDeepCompare({
  onlyCompareProps: ['name', 'email'],
});


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
    `of "${HttpStatusCodes.OK}" if the request was successful.`, async () => {
      const res: TRes<{ users: IUser[]}> = await agent.get(Paths.Users.Get);
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(compareUserArrays(res.body.users, DB_USERS)).toBeTruthy();
    });
  });

  // Test add user
  describe(`"POST:${Paths.Users.Add}"`, () => {

    // Test add user success
    it(`should return a status code of "${HttpStatusCodes.CREATED}" if the ` + 
    'request was successful.', async () => {
      const user = User.new({ name: 'a', email: 'a@a.com' }),
        res = await agent.post(Paths.Users.Add).send({ user });
      expect(res.status).toBe(HttpStatusCodes.CREATED);
    });

    // Missing param
    it('should return a JSON object with an error message of and a status ' + 
      `code of "${HttpStatusCodes.BAD_REQUEST}" if the user param was ` + 
      'missing.', async () => {
      const res: TRes = await agent.post(Paths.Users.Add).send({ user: null });
      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      const errorObj = parseValidationErr(res.body.error);
      expect(errorObj.message).toBe(ValidationError.MESSAGE);
      expect(errorObj.errors[0].prop).toBe('user');
    });
  });

  // Update users
  describe(`"PUT:${Paths.Users.Update}"`, () => {

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', async () => {
      const user = DB_USERS[0];
      user.name = 'Bill';
      const res = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(HttpStatusCodes.OK);
    });

    // Id is the wrong data type
    it('should return a JSON object with an error message and a status code ' +
    `of "${HttpStatusCodes.BAD_REQUEST}" if the user param was missing`, 
    async () => {
      const user = User.new();
      user.id = ('5' as unknown as number);
      const res: TRes = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      const errorObj = parseValidationErr(res.body.error);
      expect(errorObj.message).toBe(ValidationError.MESSAGE);
      expect(errorObj.errors[0].prop).toBe('user');
      expect(errorObj.errors[0].children?.[0].prop).toBe('id');
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, async () => {
      const user = User.new({ id: 4, name: 'a', email: 'a@a.com' }),
        res: TRes = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
    });
  });

  // Delete User
  describe(`"DELETE:${Paths.Users.Delete}"`, () => {

    const getPath = (id: number) => insertUrlParams(Paths.Users.Delete, 
      { id });

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', async () => {
      const id = dbUsers[0].id,
        res = await agent.delete(getPath(id));
      expect(res.status).toBe(HttpStatusCodes.OK);
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, async () => {
      const res: TRes = await agent.delete(getPath(-1));
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
    });
  });
});
