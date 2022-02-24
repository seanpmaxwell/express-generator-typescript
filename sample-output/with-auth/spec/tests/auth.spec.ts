import bcrypt from 'bcrypt';
import StatusCodes from 'http-status-codes';
import supertest, { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import userRepo from '@repos/user-repo';
import User, { UserRoles } from '@models/user-model';
import { cookieProps, p as paths } from '@routes/auth-router';
import { pErr } from '@shared/functions';
import { pwdSaltRounds } from 'spec/support/login-agent';
import { UnauthorizedError } from '@shared/errors';


type TReqBody = string | object | undefined;


describe('auth-router', () => {

    const authPath = '/api/auth';
    const loginPath = `${authPath}${paths.login}`;
    const logoutPath = `${authPath}${paths.logout}`;
    const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;

    let agent: SuperTest<Test>;


    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });


    describe(`"POST:${loginPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
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
            const loginUser = User.new('john smith', creds.email, role, pwdHash);
            spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
            // Call API
            callApi(creds)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.headers['set-cookie'][0]).toContain(cookieProps.key);
                    done();
                });
        });


        it(`should return a response with a status of ${UNAUTHORIZED} and a json with the error
            "${UnauthorizedError.Msg}" if the email was not found.`, (done) => {
            // Setup Dummy Data
            const creds = {
                email: 'jsmith@gmail.com',
                password: 'Password@1',
            };
            spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(null));
            // Call API
            callApi(creds)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(UNAUTHORIZED);
                    expect(res.body.error).toBe(UnauthorizedError.Msg);
                    done();
                });
        });


        it(`should return a response with a status of ${UNAUTHORIZED} and a json with the error
            "${UnauthorizedError.Msg}" if the password failed.`, (done) => {
            // Setup Dummy Data
            const creds = {
                email: 'jsmith@gmail.com',
                password: 'someBadPassword',
            };
            const role = UserRoles.Standard;
            const pwdHash = hashPwd('Password@1');
            const loginUser = User.new('john smith', creds.email, role, pwdHash);
            spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
            // Call API
            callApi(creds)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(UNAUTHORIZED);
                    expect(res.body.error).toBe(UnauthorizedError.Msg);
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
            spyOn(userRepo, 'getOne').and.throwError('Database query failed.');
            // Call API
            callApi(creds)
                .end((err: Error, res: Response) => {
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
                .end((err: Error, res: Response) => {
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

