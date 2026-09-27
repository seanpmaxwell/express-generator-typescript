import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import { agent } from './support/agent';

// ========================================================================= //
//                                   TESTS                                   //
// ========================================================================= //

describe('Front-end content', () => {
  it('should redirect "/" to the users page.', async () => {
    const res = await agent.get('/');
    expect(res.status).toBe(HttpStatusCodes.FOUND);
    expect(res.headers.location).toBe('/users');
  });

  it('should serve the users page.', async () => {
    const res = await agent.get('/users');
    expect(res.status).toBe(HttpStatusCodes.OK);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  it.each([
    '/scripts/HttpClient.js',
    '/scripts/renderUsers.js',
    '/scripts/users.js',
    '/scripts/lib/bootstrap.bundle.min.js',
    '/stylesheets/users.css',
    '/stylesheets/lib/bootstrap.min.css',
  ])('should serve the static asset "%s".', async (asset) => {
    const res = await agent.get(asset);
    expect(res.status).toBe(HttpStatusCodes.OK);
  });
});
