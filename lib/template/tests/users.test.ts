import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import User, { type UserEntity } from '@src/entities/User';
import UserRepo, { UserRepoTestOnly } from '@src/repos/UserRepo';
import UserService from '@src/services/UserService';

import { agent } from './support/agent';
import {
  extractErrMsg,
  type TypedErrRes,
  type TypedRes,
} from './support/utils';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// Shorthand the `Paths`
const P = {
  Get: {
    CALL: Paths.Users.Get.FULL_PATH,
    DISPLAY: Paths.Users.Get.DISPLAY,
  },
  Add: {
    CALL: Paths.Users.Add.FULL_PATH,
    DISPLAY: Paths.Users.Add.DISPLAY,
  },
  Update: {
    CALL: Paths.Users.Update.FULL_PATH,
    DISPLAY: Paths.Users.Update.DISPLAY,
  },
  Delete: {
    CALL: Paths.Users.Delete.format,
    DISPLAY: Paths.Users.Delete.DISPLAY,
    FULL_PATH: Paths.Users.Delete.FULL_PATH,
  },
} as const;

// Errors
const Errors = {
  ...UserService.Errors,
} as const;

// Status codes
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

  // --- `Get` ---
  describe(P.Get.DISPLAY, () => {
    describe('on success', () => {
      it(`returns all users as JSON with status "${OK}"`, async () => {
        const res: TypedRes<{ users: UserEntity[] }> = await agent.get(
          P.Get.CALL,
        );
        expect(res.status).toBe(OK);
        expect(res.body.users).toStrictEqual(DUMMY_USERS);
      });
    });

    describe('when an unexpected error is thrown', () => {
      it(`returns status "${INTERNAL_SERVER_ERROR}"`, async () => {
        const error = new Error('boom');
        const getAllSpy = vi.spyOn(UserService, 'getAll');
        getAllSpy.mockRejectedValueOnce(error);
        const res: TypedErrRes = await agent.get(P.Get.CALL);
        expect(res.status).toBe(INTERNAL_SERVER_ERROR);
        expect(res.body.error).toBe('Internal Server Error');
      });
    });
  });

  // --- `Add` ---
  describe(P.Add.DISPLAY, () => {
    describe('on success', () => {
      it(`persists the user and returns status "${CREATED}"`, async () => {
        // Same payload shape the front-end sends
        const input = { name: 'a', email: 'a@a.com' };
        const res: TypedRes<{ user: UserEntity }> = await agent
          .post(P.Add.CALL)
          .send({ user: input });
        expect(res.status).toBe(CREATED);
        const isId = User.is.id(res.body.user.id);
        expect(isId).toBe(true);
        const all = await UserRepo.getAll();
        expect(all).toHaveLength(DUMMY_USERS.length + 1);
        expect(all).toContainEqual(res.body.user);
      });
    });

    describe('when the user param is missing', () => {
      it('returns a validation error', async () => {
        const res = await agent.post(P.Add.CALL).send({ user: null });
        expect(res.status).toBe(BAD_REQUEST);
        const errMsg = extractErrMsg(res);
        expect(errMsg).toBe('Invalid input: expected object, received null');
      });
    });

    describe('when the name is empty', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const res = await agent
          .post(P.Add.CALL)
          .send({ user: { name: '', email: 'a@a.com' } });
        expect(res.status).toBe(BAD_REQUEST);
        // Verify it didn't persist in the database
        const allUsers = await UserRepo.getAll();
        expect(allUsers).toHaveLength(DUMMY_USERS.length);
      });
    });

    describe('when the request body cannot be parsed', () => {
      it('returns 400 for malformed JSON without persisting a user', async () => {
        const res: TypedErrRes = await agent
          .post(P.Add.CALL)
          .set('Content-Type', 'application/json')
          .send('{"user":');
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toStrictEqual({ error: 'Invalid JSON' });
        expect(await UserRepo.getAll()).toStrictEqual(DUMMY_USERS);
      });

      it.each([
        [
          'application/json',
          JSON.stringify({ user: { name: 'a'.repeat(110000) } }),
        ],
        [
          'application/x-www-form-urlencoded',
          `user[name]=${'a'.repeat(110000)}`,
        ],
      ])('returns 413 for an oversized %s body', async (contentType, body) => {
        const res: TypedErrRes = await agent
          .post(P.Add.CALL)
          .set('Content-Type', contentType)
          .send(body);
        expect(res.status).toBe(HttpStatusCodes.PAYLOAD_TOO_LARGE);
        expect(res.body).toStrictEqual({ error: 'Request body too large' });
        expect(await UserRepo.getAll()).toStrictEqual(DUMMY_USERS);
      });
    });
  });

  // --- `Update` ---
  describe(P.Update.DISPLAY, () => {
    describe('on success', () => {
      it(`saves the change and returns status "${OK}"`, async () => {
        const user = { ...dbUsers[0], name: 'Bill' };
        const res = await agent.put(P.Update.CALL).send({ user });
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
        const res = await agent.put(P.Update.CALL).send({ user });
        expect(res.status).toBe(BAD_REQUEST);
        const errMsg = extractErrMsg(res);
        expect(errMsg).toBe(errMsg);
      });
    });

    describe('when the user is not found', () => {
      it(`returns status "${NOT_FOUND}"`, async () => {
        const user = User.create({ name: 'a', email: 'a@a.com' });
        const res: TypedErrRes = await agent.put(P.Update.CALL).send({ user });
        expect(res.status).toBe(NOT_FOUND);
        expect(res.body.error).toBe(Errors.USER_NOT_FOUND);
      });
    });
  });

  // --- `Delete` ---
  describe(P.Delete.DISPLAY, () => {
    describe('on success', () => {
      it(`removes the user and returns status "${OK}"`, async () => {
        const id = dbUsers[0].id;
        const path = P.Delete.CALL(id);
        const res = await agent.delete(path);
        expect(res.status).toBe(OK);
        const persists = await UserRepo.persists(id);
        expect(persists).toBe(false);
      });
    });

    describe('when the user is not found', () => {
      it(`returns status "${NOT_FOUND}"`, async () => {
        const id = User.genId();
        const path = P.Delete.CALL(id);
        const res: TypedErrRes = await agent.delete(path);
        expect(res.status).toBe(NOT_FOUND);
        expect(res.body.error).toBe(Errors.USER_NOT_FOUND);
      });
    });

    describe('when the id is invalid', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const path = P.Delete.CALL('asdf');
        const res = await agent.delete(path);
        expect(res.status).toBe(BAD_REQUEST);
      });
    });

    describe('when the id path param is missing', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const res = await agent.delete(P.Delete.FULL_PATH);
        expect(res.status).toBe(BAD_REQUEST);
        const errMsg = extractErrMsg(res);
        expect(errMsg).toStrictEqual('Not a valid uuid7 id');
      });
    });
  });
});
