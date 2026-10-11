import { before } from 'node:test';
import supertest, { type Test } from 'supertest';
import type TestAgent from 'supertest/lib/agent.js';

import MockOrm from '#src/repos/MockOrm.ts';
import app from '#src/server.ts';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

let agent: TestAgent<Test>;

before(async () => {
  agent = supertest.agent(app);
  await MockOrm.cleanDb();
});

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export { agent };
