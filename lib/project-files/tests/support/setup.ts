
import { beforeAll } from 'vitest';
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';
import UserRepo from '@src/repos/UserRepo';


/******************************************************************************
                                    Run
******************************************************************************/

let agent: TestAgent<Test>;

beforeAll(async () => {
  agent = supertest.agent(app);
  await Promise.all([
    UserRepo.deleteAllUsers(),
  ]);
});


/******************************************************************************
                                    Export
******************************************************************************/

export { agent };
