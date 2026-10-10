import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import HttpStatusCodes from '#src/common/constants/HttpStatusCodes.ts';
import Paths from '#src/common/constants/Paths/index.ts';
import User, { type UserEntity } from '#src/entities/User/index.ts';
import UserRepo, { UserRepoTestOnly } from '#src/repos/UserRepo.ts';
import UserService from '#src/services/UserService.ts';

import { agent } from './support/agent.ts';
import {
  extractErrMsg,
  type TypedErrRes,
  type TypedRes,
} from './support/utils.ts';

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

  // --- `Get` ---
  describe(P.Get.DISPLAY, () => {
    describe('on success', () => {
      it(`returns all users as JSON with status "${OK}"`, async () => {
        const res: TypedRes<{ users: UserEntity[] }> = await agent.get(
          P.Get.CALL,
        );
        assert.equal(res.status, OK);
        assert.deepEqual(res.body.users, DUMMY_USERS);
      });
    });

    describe('when an unexpected error is thrown', () => {
      it(`returns status "${INTERNAL_SERVER_ERROR}"`, async (t) => {
        const error = new Error('boom');
        // Mocks made through `t.mock` are restored when the test ends
        t.mock.method(UserService, 'getAll', () => Promise.reject(error));
        const res: TypedErrRes = await agent.get(P.Get.CALL);
        assert.equal(res.status, INTERNAL_SERVER_ERROR);
        assert.equal(res.body.error, 'Internal Server Error');
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
        assert.equal(res.status, CREATED);
        const isId = User.is.id(res.body.user.id);
        assert.equal(isId, true);
        const all = await UserRepo.getAll();
        assert.equal(all.length, DUMMY_USERS.length + 1);
        const saved = all.find((u) => u.id === res.body.user.id);
        assert.deepEqual(saved, res.body.user);
      });
    });

    describe('when the user param is missing', () => {
      it('returns a validation error', async () => {
        const res = await agent.post(P.Add.CALL).send({ user: null });
        assert.equal(res.status, BAD_REQUEST);
        const errMsg = extractErrMsg(res);
        assert.equal(errMsg, 'Invalid input: expected object, received null');
      });
    });

    describe('when the name is empty', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const res = await agent
          .post(P.Add.CALL)
          .send({ user: { name: '', email: 'a@a.com' } });
        assert.equal(res.status, BAD_REQUEST);
        // Verify it didn't persist in the database
        const allUsers = await UserRepo.getAll();
        assert.equal(allUsers.length, DUMMY_USERS.length);
      });
    });

    describe('when the request body cannot be parsed', () => {
      it('returns 400 for malformed JSON without persisting a user', async () => {
        const res: TypedErrRes = await agent
          .post(P.Add.CALL)
          .set('Content-Type', 'application/json')
          .send('{"user":');
        assert.equal(res.status, BAD_REQUEST);
        assert.deepEqual(res.body, { error: 'Invalid JSON' });
        assert.deepEqual(await UserRepo.getAll(), DUMMY_USERS);
      });

      const oversizedBodies = [
        [
          'application/json',
          JSON.stringify({ user: { name: 'a'.repeat(110000) } }),
        ],
        [
          'application/x-www-form-urlencoded',
          `user[name]=${'a'.repeat(110000)}`,
        ],
      ] as const;

      for (const [contentType, body] of oversizedBodies) {
        it(`returns 413 for an oversized ${contentType} body`, async () => {
          const res: TypedErrRes = await agent
            .post(P.Add.CALL)
            .set('Content-Type', contentType)
            .send(body);
          assert.equal(res.status, HttpStatusCodes.PAYLOAD_TOO_LARGE);
          assert.deepEqual(res.body, { error: 'Request body too large' });
          assert.deepEqual(await UserRepo.getAll(), DUMMY_USERS);
        });
      }
    });
  });

  // --- `Update` ---
  describe(P.Update.DISPLAY, () => {
    describe('on success', () => {
      it(`saves the change and returns status "${OK}"`, async () => {
        const user = { ...dbUsers[0], name: 'Bill' };
        const res = await agent.put(P.Update.CALL).send({ user });
        assert.equal(res.status, OK);
        const allUsers = await UserRepo.getAll();
        const saved = allUsers.find((u) => u.id === user.id);
        assert.equal(saved?.name, 'Bill');
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
        assert.equal(res.status, BAD_REQUEST);
        const errMsg = extractErrMsg(res);
        assert.equal(errMsg, 'Not a valid uuid7 id');
      });
    });

    describe('when the user is not found', () => {
      it(`returns status "${NOT_FOUND}"`, async () => {
        const user = User.create({ name: 'a', email: 'a@a.com' });
        const res: TypedErrRes = await agent.put(P.Update.CALL).send({ user });
        assert.equal(res.status, NOT_FOUND);
        assert.equal(res.body.error, Errors.USER_NOT_FOUND);
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
        assert.equal(res.status, OK);
        const persists = await UserRepo.persists(id);
        assert.equal(persists, false);
      });
    });

    describe('when the user is not found', () => {
      it(`returns status "${NOT_FOUND}"`, async () => {
        const id = User.genId();
        const path = P.Delete.CALL(id);
        const res: TypedErrRes = await agent.delete(path);
        assert.equal(res.status, NOT_FOUND);
        assert.equal(res.body.error, Errors.USER_NOT_FOUND);
      });
    });

    describe('when the id is invalid', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const path = P.Delete.CALL('asdf');
        const res = await agent.delete(path);
        assert.equal(res.status, BAD_REQUEST);
      });
    });

    describe('when the id path param is missing', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const res = await agent.delete(P.Delete.FULL_PATH);
        assert.equal(res.status, BAD_REQUEST);
        const errMsg = extractErrMsg(res);
        assert.equal(errMsg, 'Not a valid uuid7 id');
      });
    });
  });
});
