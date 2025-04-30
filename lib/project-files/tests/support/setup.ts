
import { beforeAll } from 'vitest';
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';
import MockOrm from '@src/repos/MockOrm';


/******************************************************************************
                                    Run
******************************************************************************/

let agent: TestAgent<Test>;

beforeAll(async () => {
  agent = supertest.agent(app);
  await MockOrm.cleanDb();
});


/******************************************************************************
                                    Export
******************************************************************************/

export { agent };
