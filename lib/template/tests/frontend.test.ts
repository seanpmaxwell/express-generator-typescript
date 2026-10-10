import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import HttpStatusCodes from '#src/common/constants/HttpStatusCodes.ts';

import { agent } from './support/agent.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const STATIC_ASSETS = [
  '/scripts/HttpClient.js',
  '/scripts/renderUsers.js',
  '/scripts/users.js',
  '/scripts/lib/bootstrap.bundle.min.js',
  '/stylesheets/users.css',
  '/stylesheets/lib/bootstrap.min.css',
] as const;

// ========================================================================= //
//                                   TESTS                                   //
// ========================================================================= //

describe('Front-end content', () => {
  it('should redirect "/" to the users page.', async () => {
    const res = await agent.get('/');
    assert.equal(res.status, HttpStatusCodes.FOUND);
    assert.equal(res.headers.location, '/users');
  });

  it('should serve the users page.', async () => {
    const res = await agent.get('/users');
    assert.equal(res.status, HttpStatusCodes.OK);
    assert.match(res.headers['content-type'], /html/);
  });

  for (const asset of STATIC_ASSETS) {
    it(`should serve the static asset "${asset}".`, async () => {
      const res = await agent.get(asset);
      assert.equal(res.status, HttpStatusCodes.OK);
    });
  }
});
