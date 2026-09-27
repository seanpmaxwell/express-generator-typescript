import supertest, { type Test } from 'supertest';
import type TestAgent from 'supertest/lib/agent.js';
import { beforeAll } from 'vitest';

import MockOrm from '@src/repos/MockOrm';
import app from '@src/server';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

let agent: TestAgent<Test>;

beforeAll(async () => {
  agent = supertest.agent(app);
  await MockOrm.cleanDb();
});

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export { agent };
