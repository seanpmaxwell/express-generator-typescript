import jetid from 'jet-id';

import { ValidationError } from '@src/common/classes/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import User, { type UserEntity } from '@src/entities/User';
import UserRepo, { UserRepoTestOnly } from '@src/repos/UserRepo';
import UserService from '@src/services/UserService';

import { compareUserArrays } from './common/comparators';
import type { TestRes } from './common/supertest-types';
import { agent } from './support/agent';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// Path constants
const PATH_USERS_GET = Paths.Users.Get();
const PATH_USERS_ADD = Paths.Users.Add();
const PATH_USERS_UPDATE = Paths.Users.Update();
const PATH_USERS_DELETE = Paths.Users.Delete.$tmpl;

// Errors
const ERR_USER_NOT_FOUND = UserService.Errors.USER_NOT_FOUND;
const { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK, NOT_FOUND } =
  HttpStatusCodes;

const DUMMY_USERS = [
  User.of('Sean Maxwell', 'sean.maxwell@gmail.com'),
  User.of('John Smith', 'john.smith@gmail.com'),
  User.of('Gordan Freeman', 'gordan.freeman@gmail.com'),
] as const;

// ========================================================================= //
//                                   TESTS                                   //
// ========================================================================= //
//  IMPORTANT: Following TypeScript best practices, we test all scenarios that
//  can be triggered by a user under normal circumstances. Not all theoretically
//  scenarios (i.e. a failed database connection).

describe('UserRouter', () => {
  let dbUsers: UserEntity[] = [];

  beforeEach(async () => {
    await UserRepoTestOnly.deleteAllUsers();
    dbUsers = await UserRepoTestOnly.insertMultiple(DUMMY_USERS);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---- `Get`
  describe(`"GET - ${PATH_USERS_GET}"`, () => {
    describe('on success', () => {
      it(`returns all users as JSON with status "${OK}"`, async () => {
        const res: TestRes<{ users: UserEntity[] }> =
          await agent.get(PATH_USERS_GET);
        expect(res.status).toBe(OK);
        const usersMatch = compareUserArrays(res.body.users, DUMMY_USERS);
        expect(usersMatch).toBeTruthy();
      });
    });

    describe('when an unexpected error is thrown', () => {
      it(`returns status "${INTERNAL_SERVER_ERROR}"`, async () => {
        const error = new Error('boom');
        const getAllSpy = vi.spyOn(UserService, 'getAll');
        getAllSpy.mockRejectedValueOnce(error);
        const res: TestRes = await agent.get(PATH_USERS_GET);
        expect(res.status).toBe(INTERNAL_SERVER_ERROR);
        expect(res.body.error).toBe('Internal Server Error');
      });
    });
  });

  // ---- `Add`
  describe(`"POST - ${PATH_USERS_ADD}"`, () => {
    describe('on success', () => {
      it(`persists the user and returns status "${CREATED}"`, async () => {
        // Same payload shape the front-end sends
        const input = { name: 'a', email: 'a@a.com' };
        const res: TestRes<{ user: UserEntity }> = await agent
          .post(PATH_USERS_ADD)
          .send({ user: input });
        expect(res.status).toBe(CREATED);
        const isId = User.isId(res.body.user.id);
        expect(isId).toBe(true);
        const all = await UserRepo.getAll();
        expect(all).toHaveLength(DUMMY_USERS.length + 1);
        expect(all).toContainEqual(res.body.user);
      });
    });

    describe('when the user param is missing', () => {
      it('returns a validation error', async () => {
        const res: TestRes = await agent
          .post(PATH_USERS_ADD)
          .send({ user: null });
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(ValidationError.MESSAGE);
        expect(res.body.errors?.[0].key).toStrictEqual('user');
      });
    });

    describe('when the name is empty', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const res: TestRes = await agent
          .post(PATH_USERS_ADD)
          .send({ user: { name: '', email: 'a@a.com' } });
        expect(res.status).toBe(BAD_REQUEST);
        const allUsers = await UserRepo.getAll();
        expect(allUsers).toHaveLength(DUMMY_USERS.length);
      });
    });
  });

  // ---- `Update`
  describe(`"PUT - ${PATH_USERS_UPDATE}"`, () => {
    describe('on success', () => {
      it(`saves the change and returns status "${OK}"`, async () => {
        const user = { ...dbUsers[0], name: 'Bill' };
        const res = await agent.put(PATH_USERS_UPDATE).send({ user });
        expect(res.status).toBe(OK);
        const allUsers = await UserRepo.getAll();
        const saved = allUsers.find((u) => u.id === user.id);
        expect(saved?.name).toBe('Bill');
      });
    });

    describe('when the id is invalid', () => {
      it('returns a validation error', async () => {
        const newUser = User.create();
        const user = {
          ...newUser,
          name: 'a',
          email: 'a@a.com',
          id: '5',
        };
        const res: TestRes = await agent.put(PATH_USERS_UPDATE).send({ user });
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(ValidationError.MESSAGE);
        expect(res.body.errors?.[0].keyPath).toStrictEqual(['user', 'id']);
      });
    });

    describe('when the user is not found', () => {
      it(`returns status "${NOT_FOUND}"`, async () => {
        const id = jetid();
        const user = User.create({ id, name: 'a', email: 'a@a.com' });
        const res: TestRes = await agent.put(PATH_USERS_UPDATE).send({ user });
        expect(res.status).toBe(NOT_FOUND);
        expect(res.body.error).toBe(ERR_USER_NOT_FOUND);
      });
    });
  });

  // ---- `Delete`
  describe(`"DELETE - ${PATH_USERS_DELETE}"`, () => {
    describe('on success', () => {
      it(`removes the user and returns status "${OK}"`, async () => {
        const id = dbUsers[0].id;
        const path = Paths.Users.Delete({ id });
        const res = await agent.delete(path);
        expect(res.status).toBe(OK);
        const persists = await UserRepo.persists(id);
        expect(persists).toBe(false);
      });
    });

    describe('when the user is not found', () => {
      it(`returns status "${NOT_FOUND}"`, async () => {
        const id = jetid();
        const path = Paths.Users.Delete({ id });
        const res: TestRes = await agent.delete(path);
        expect(res.status).toBe(NOT_FOUND);
        expect(res.body.error).toBe(ERR_USER_NOT_FOUND);
      });
    });

    describe('when the id is invalid', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const path = Paths.Users.Delete({ id: -1 });
        const res = await agent.delete(path);
        expect(res.status).toBe(BAD_REQUEST);
      });
    });

    describe('when the id path param is missing', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const res: TestRes = await agent.delete(PATH_USERS_DELETE);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.errors?.[0].key).toStrictEqual('id');
      });
    });
  });
});
