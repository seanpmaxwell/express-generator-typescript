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

const DUMMY_USERS = [
  User.new({ name: 'Sean Maxwell', email: 'sean.maxwell@gmail.com' }),
  User.new({ name: 'John Smith', email: 'john.smith@gmail.com' }),
  User.new({ name: 'Gordan Freeman', email: 'gordan.freeman@gmail.com' }),
] as const;

const {
  BadRequest,
  Created,
  Ok: OK,
  NotFound,
} = HTTP_STATUS_CODES;

/******************************************************************************
                                 Tests
  IMPORTANT: Following TypeScript best practices, we test all scenarios that 
  can be triggered by a user under normal circumstances. Not all theoretically
  scenarios (i.e. a failed database connection). 
******************************************************************************/

describe('UserRouter', () => {

  let dbUsers: IUser[] = [];

  beforeEach(async () => {
    await UserRepo.deleteAllUsers();
    dbUsers = await UserRepo.insertMultiple(DUMMY_USERS);
  });

  describe(`"GET:${Paths.Users.Get}"`, () => {

    it('should return a JSON object with all the users and a status code of ' + 
    `"${OK}" if the request was successful.`, async () => {
      const res: TRes<{ users: IUser[]}> = await agent.get(Paths.Users.Get);
      expect(res.status).toBe(OK);
      expect(compareUserArrays(res.body.users, DUMMY_USERS)).toBeTruthy();
    });
  });

  describe(`"POST:${Paths.Users.Add}"`, () => {

    it(`should return a status code of "${Created}" if the request was ` + 
    'successful.', async () => {
      const user = User.new({ name: 'a', email: 'a@a.com' }),
        res = await agent.post(Paths.Users.Add).send({ user });
      expect(res.status).toBe(Created);
    });

    it('should return a JSON object with an error message of and a status ' + 
      `code of "${BadRequest}" if the user param was missing.`, async () => {
      const res: TRes = await agent.post(Paths.Users.Add).send({ user: null });
      expect(res.status).toBe(BadRequest);
      const errorObject = parseValidationError(res.body.error);
      expect(errorObject.message).toBe(ValidationError.MESSAGE);
      expect(errorObject.errors[0].key).toStrictEqual('user');
    });
  });

  describe(`"PUT:${Paths.Users.Update}"`, () => {

    it(`should return a status code of "${OK}" if the request was successfull`, 
      async () => {
        const user = DUMMY_USERS[0];
        user.name = 'Bill';
        const res = await agent.put(Paths.Users.Update).send({ user });
        expect(res.status).toBe(OK);
      });

    it('should return a JSON object with an error message and a status code ' +
    `of "${BadRequest}" if id is the wrong data type`, async () => {
      const user = User.new();
      user.id = ('5' as unknown as number);
      const res: TRes = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(BadRequest);
      const errorObj = parseValidationError(res.body.error);
      expect(errorObj.message).toBe(ValidationError.MESSAGE);
      expect(errorObj.errors[0].keyPath).toStrictEqual(['user', 'id']);
    });

    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of "${NotFound}" if the id ` + 
    'was not found.', async () => {
      const user = User.new({ id: 4, name: 'a', email: 'a@a.com' }),
        res: TRes = await agent.put(Paths.Users.Update).send({ user });
      expect(res.status).toBe(NotFound);
      expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
    });
  });

  describe(`"DELETE:${Paths.Users.Delete()}"`, () => {

    it(`should return a status code of "${OK}" if the request was successful.`, 
      async () => {
        const id = dbUsers[0].id,
          res = await agent.delete(Paths.Users.Delete(id));
        expect(res.status).toBe(OK);
      });

    it('should return a JSON object with the error message of ' + 
    `"${USER_NOT_FOUND_ERR}" and a status code of "${NotFound}" if the id ` + 
    'was not found.', async () => {
      const res: TRes = await agent.delete(Paths.Users.Delete(-1));
      expect(res.status).toBe(NotFound);
      expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
    });
  });
});
