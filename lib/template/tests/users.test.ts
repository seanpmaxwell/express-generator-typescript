import jetid from 'jet-id';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import { ValidationError } from '@src/common/classes/route-errors';
import User, { type UserEntity } from '@src/entities/User';
import UserRepo from '@src/repos/UserRepo';
import UserService from '@src/services/UserService';

import { compareUserArrays } from './common/comparators';
import type { TestRes } from './common/supertest-types';
import { agent } from './support/agent';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const DUMMY_USERS = [
  User.of('Sean Maxwell', 'sean.maxwell@gmail.com'),
  User.of('John Smith', 'john.smith@gmail.com'),
  User.of('Gordan Freeman', 'gordan.freeman@gmail.com'),
] as const;

const { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK, NOT_FOUND } =
  HttpStatusCodes;

// ========================================================================= //
//                                   TESTS                                   //
// ========================================================================= //
//  IMPORTANT: Following TypeScript best practices, we test all scenarios that
//  can be triggered by a user under normal circumstances. Not all theoretically
//  scenarios (i.e. a failed database connection).

describe('UserRouter', () => {
  let dbUsers: UserEntity[] = [];

  beforeEach(async () => {
    await UserRepo.deleteAllUsers();
    dbUsers = await UserRepo.insertMultiple(DUMMY_USERS);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---- `Get`
  describe(`"GET:${Paths.Users.Get()}"`, () => {
    it(
      'should return a JSON object with all the users and a status code of ' +
        `"${OK}" if the request was successful.`,
      async () => {
        const res: TestRes<{ users: UserEntity[] }> = await agent.get(
          Paths.Users.Get(),
        );
        expect(res.status).toBe(OK);
        expect(compareUserArrays(res.body.users, DUMMY_USERS)).toBeTruthy();
      },
    );

    it(
      `should return a JSON error and a status code of ` +
        `"${INTERNAL_SERVER_ERROR}" if an unexpected error is thrown.`,
      async () => {
        vi.spyOn(UserService, 'getAll').mockRejectedValueOnce(
          new Error('boom'),
        );
        const res: TestRes = await agent.get(Paths.Users.Get());
        expect(res.status).toBe(INTERNAL_SERVER_ERROR);
        expect(res.body.error).toBe('Internal Server Error');
      },
    );
  });

  // ---- `Add`
  describe(`"POST:${Paths.Users.Add()}"`, () => {
    it(
      `should return a status code of "${CREATED}" and persist the user ` +
        'with a server-generated id if the request was successful.',
      async () => {
        // Same payload shape the front-end sends
        const input = { name: 'a', email: 'a@a.com' };
        const res: TestRes<{ user: UserEntity }> = await agent
          .post(Paths.Users.Add())
          .send({ user: input });
        expect(res.status).toBe(CREATED);
        expect(User.isId(res.body.user.id)).toBe(true);
        const all = await UserRepo.getAll();
        expect(all).toHaveLength(DUMMY_USERS.length + 1);
        expect(all).toContainEqual(res.body.user);
      },
    );

    it(
      'should return a JSON object with an error message and a status ' +
        `code of "${BAD_REQUEST}" if the user param was missing.`,
      async () => {
        const res: TestRes = await agent
          .post(Paths.Users.Add())
          .send({ user: null });
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(ValidationError.MESSAGE);
        expect(res.body.errors?.[0].key).toStrictEqual('user');
      },
    );

    it(
      `should return a status code of "${BAD_REQUEST}" if the name is ` +
        'empty.',
      async () => {
        const res: TestRes = await agent
          .post(Paths.Users.Add())
          .send({ user: { name: '', email: 'a@a.com' } });
        expect(res.status).toBe(BAD_REQUEST);
        expect(await UserRepo.getAll()).toHaveLength(DUMMY_USERS.length);
      },
    );
  });

  // ---- `Update`
  describe(`"PUT:${Paths.Users.Update()}"`, () => {
    it(
      `should return a status code of "${OK}" and save the change if the ` +
        'request was successful.',
      async () => {
        const user = { ...dbUsers[0], name: 'Bill' };
        const res = await agent.put(Paths.Users.Update()).send({ user });
        expect(res.status).toBe(OK);
        const saved = (await UserRepo.getAll()).find((u) => u.id === user.id);
        expect(saved?.name).toBe('Bill');
      },
    );

    it(
      'should return a JSON object with an error message and a status code ' +
        `of "${BAD_REQUEST}" if id is not a valid id`,
      async () => {
        const user = { ...User.create(), name: 'a', email: 'a@a.com', id: '5' };
        const res: TestRes = await agent
          .put(Paths.Users.Update())
          .send({ user });
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(ValidationError.MESSAGE);
        expect(res.body.errors?.[0].keyPath).toStrictEqual(['user', 'id']);
      },
    );

    it(
      'should return a JSON object with the error message of ' +
        `"${UserService.Errors.USER_NOT_FOUND}" and a status code of ` +
        `"${NOT_FOUND}" if the id was not found.`,
      async () => {
        const user = User.create({ id: jetid(), name: 'a', email: 'a@a.com' }),
          res: TestRes = await agent.put(Paths.Users.Update()).send({ user });
        expect(res.status).toBe(NOT_FOUND);
        expect(res.body.error).toBe(UserService.Errors.USER_NOT_FOUND);
      },
    );
  });

  // ---- `Delete`
  describe(`"DELETE:${Paths.Users.Delete()}"`, () => {
    it(
      `should return a status code of "${OK}" and remove the user if the ` +
        'request was successful.',
      async () => {
        const id = dbUsers[0].id,
          res = await agent.delete(Paths.Users.Delete({ id }));
        expect(res.status).toBe(OK);
        expect(await UserRepo.persists(id)).toBe(false);
      },
    );

    it(
      'should return a JSON object with the error message of ' +
        `"${UserService.Errors.USER_NOT_FOUND}" and a status code of ` +
        `"${NOT_FOUND}" if the id was not found.`,
      async () => {
        const res: TestRes = await agent.delete(
          Paths.Users.Delete({ id: jetid() }),
        );
        expect(res.status).toBe(NOT_FOUND);
        expect(res.body.error).toBe(UserService.Errors.USER_NOT_FOUND);
      },
    );

    it(
      `should return a status code of "${BAD_REQUEST}" if the id is not a ` +
        'valid id.',
      async () => {
        const res = await agent.delete(Paths.Users.Delete({ id: -1 }));
        expect(res.status).toBe(BAD_REQUEST);
      },
    );

    it(
      `should return a status code of "${BAD_REQUEST}" if the id query ` +
        'param is missing.',
      async () => {
        const res: TestRes = await agent.delete(Paths.Users.Delete());
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.errors?.[0].key).toStrictEqual('id');
      },
    );
  });
});
