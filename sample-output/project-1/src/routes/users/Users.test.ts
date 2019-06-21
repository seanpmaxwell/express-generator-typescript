import { BAD_REQUEST, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import { User } from '@entities';
import { logger } from '@shared';

import supertest from 'supertest';
import app from '@server';
import UserRouter from './Users';

import * as userRouterItems from './Users';


describe('Users Routes', () => {

    const usersPath = '/api' + UserRouter.path;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe('GET "/api/users/:name/:email"', () => {

        const user = new User('sean', 'sean@express-generator-typescript.com');

        it(`should return a JSON object with a user object and a status code of ${OK} if the
            request was successful`, (done) => {

            agent.get(`${usersPath}/${user.name}/${user.email}`)
                .end((err: Error, res: Response) => {
                    if (err) { logger.error(err); }
                    expect(res.status).toBe(OK);
                    const retUser = new User(res.body.user);
                    expect(retUser).toEqual(user);
                    done();
                });
        });

        const {
            getUserParamMissing
        } = userRouterItems;

        it(`should return a JSON object with the error "${getUserParamMissing}" and a status code
            of "${BAD_REQUEST}" if one of the required user params is missing`, (done) => {

            agent.get(`${usersPath}/${user.name}/undefined`)
                .end((err: Error, res: Response) => {
                    if (err) { logger.error(err); }
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(getUserParamMissing);
                    done();
                });
        });
    });
});
