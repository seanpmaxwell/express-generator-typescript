import app from '@server';
import supertest from 'supertest';
import bcrypt from 'bcrypt';

import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import { IUser, User, UserRoles } from '@entities';
import { pErr, pwdSaltRounds, jwtCookieProps, loginFailedErr } from '@shared';
import { UserDao } from '@daos';


describe('UserRouter', () => {

    const authPath = '/api/auth';
    const loginPath = `${authPath}/login`;
    const logoutPath = `${authPath}/logout`;

    let agent: SuperTest<Test>;


    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });


    describe(`"POST:${loginPath}"`, () => {

        const callApi = (reqBody: object) => {
            return agent.post(loginPath).type('form').send(reqBody);
        };


        it(`should return a response with a status of ${OK} and a cookie with a jwt if the login
            was successful.`, (done) => {
            // Setup Dummy Data
            const creds = {
                email: 'jsmith@gmail.com',
                password: 'Password@1',
            };
            const role = UserRoles.Standard;
            const pwdHash = hashPwd(creds.password);
            const loginUser = new User('john smith', creds.email, role, pwdHash);
            spyOn(UserDao.prototype, 'getOne').and.returnValue(Promise.resolve(loginUser));
            // Call API
            callApi(creds)
                .end((err: Error, res: any) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.headers['set-cookie'][0]).toContain(jwtCookieProps.key);
                    done();
                });
        });


        it(`should return a response with a status of ${UNAUTHORIZED} and a json with the error
            "${loginFailedErr}" if the email was not found.`, (done) => {
            // Setup Dummy Data
            const creds = {
                email: 'jsmith@gmail.com',
                password: 'Password@1',
            };
            spyOn(UserDao.prototype, 'getOne').and.returnValue(Promise.resolve(null));
            // Call API
            callApi(creds)
                .end((err: Error, res: any) => {
                    pErr(err);
                    expect(res.status).toBe(UNAUTHORIZED);
                    expect(res.body.error).toBe(loginFailedErr);
                    done();
                });
        });


        it(`should return a response with a status of ${UNAUTHORIZED} and a json with the error
            "${loginFailedErr}" if the password failed.`, (done) => {
            // Setup Dummy Data
            const creds = {
                email: 'jsmith@gmail.com',
                password: 'someBadPassword',
            };
            const role = UserRoles.Standard;
            const pwdHash = hashPwd('Password@1');
            const loginUser = new User('john smith', creds.email, role, pwdHash);
            spyOn(UserDao.prototype, 'getOne').and.returnValue(Promise.resolve(loginUser));
            // Call API
            callApi(creds)
                .end((err: Error, res: any) => {
                    pErr(err);
                    expect(res.status).toBe(UNAUTHORIZED);
                    expect(res.body.error).toBe(loginFailedErr);
                    done();
                });
        });


        it(`should return a response with a status of ${BAD_REQUEST} and a json with an error
            for all other bad responses.`, (done) => {
            // Setup Dummy Data
            const creds = {
                email: 'jsmith@gmail.com',
                password: 'someBadPassword',
            };
            spyOn(UserDao.prototype, 'getOne').and.throwError('Database query failed.');
            // Call API
            callApi(creds)
                .end((err: Error, res: any) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBeTruthy();
                    done();
                });
        });
    });


    describe(`"GET:${logoutPath}"`, () => {


        it(`should return a response with a status of ${OK}.`, (done) => {
            agent.get(logoutPath)
                .end((err: Error, res: any) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    done();
                });
        });
    });


    function hashPwd(pwd: string) {
        return bcrypt.hashSync(pwd, pwdSaltRounds);
    }
});


