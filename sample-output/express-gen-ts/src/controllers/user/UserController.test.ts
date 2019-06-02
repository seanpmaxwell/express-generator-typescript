import { Logger } from '@overnightjs/logger';
import { BAD_REQUEST, OK } from 'http-status-codes';
import 'jasmine';
import * as supertest from 'supertest';
import { SuperTest, Test } from 'supertest';
import { TestServer } from '../TestServer.test';
import { UserController } from './UserController';
import { User } from '../../entities/User'


describe('UserController', () => {

    const userController = new UserController();
    let agent: SuperTest<Test>;


    beforeAll((done) => {
        const server = new TestServer();
        server.setController(userController);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });


    describe('GET /users', () => {

        const { CURRENT_ROUTE,
            REQ_PARAM_MISSING,
        } = userController;

        const user = new User('sean', 'sean@express-generator-typescript');

        it(`should return a JSON object with a user object and a status code of ${OK} if the 
            request was successful`, (done) => {

            agent.get(`${CURRENT_ROUTE}/${user.name}/${user.email}`)
                .end((err: Error, res: any) => {
                    if (err) { Logger.Err(err, true); }
                    expect(res.status).toBe(OK);
                    const retUser = new User(res.body.user);
                    expect(retUser).toEqual(user);
                    done();
                });
        });

        it(`should return a JSON object with the error '${REQ_PARAM_MISSING}' and a status code
            of ${BAD_REQUEST} if one of the required user params is missing`, (done) => {

            agent.get(`${CURRENT_ROUTE}/${user.name}/undefined`)
                .end((err: Error, res: any) => {
                    if (err) { Logger.Err(err, true); }
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(REQ_PARAM_MISSING);
                    done();
                });
        });
    });
});
