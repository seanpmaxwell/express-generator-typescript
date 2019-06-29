import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import { User } from '@entities';
import { pErr } from '@shared';

import supertest from 'supertest';
import app from '@server';
import UserRouter from './Users';

import * as userRouterItems from './Users';


describe('Users Routes', () => {

    const {
        userDao,
        getUsersPath,
        addUserPath,
        updateUserPath,
        deleteUserPath,
    } = userRouterItems;

    const usersFullPath = '/api' + UserRouter.path;
    const getUsersFullpath = usersFullPath + getUsersPath;
    const addUsersFullPath = usersFullPath + addUserPath;
    const updateUserFullPath = usersFullPath + updateUserPath;
    const deleteUserFullPath = usersFullPath + deleteUserPath;

    let agent: SuperTest<Test>;


    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });


    describe(`"GET:${getUsersFullpath}"`, () => {

        it(`should return a JSON object with all the users and a status code of ${OK} if the
            request was successful`, (done) => {

            const users = [
                new User('Sean Maxwell', 'sean.maxwell@gmail.com'),
                new User('John Smith', 'john.smith@gmail.com'),
                new User('Gordan Freeman', 'gordan.freeman@gmail.com'),
            ];

            spyOn(userDao, 'getAll').and.returnValue(Promise.resolve(users));

            agent.get(getUsersFullpath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.users).toEqual(users);
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            ${BAD_REQUEST} if the request was unsuccessful`, (done) => {

            const errMsg = 'Couldn\'t fetch users.';
            spyOn(userDao, 'getAll').and.throwError(errMsg);

            agent.get(getUsersFullpath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    describe(`"POST:${addUsersFullPath}"`, () => {

        const {
            userMissingErr,
        } = userRouterItems;

        const callApi = (reqBody: object) => {
            return agent.post(addUsersFullPath).type('form').send(reqBody);
        };

        it(`should return a status code of ${CREATED} if the request was successful`, (done) => {

            spyOn(userDao, 'add').and.returnValue(Promise.resolve());

            callApi({user})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    done();
                });
        });

        it(`should return a JSON object with an error message of ${userMissingErr} and a status code of 
            ${CREATED} if the request was successful`, (done) => {

            spyOn(userDao, 'add').and.returnValue(Promise.resolve());

            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toEqual(jasmine.any(String));
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of ${CREATED} if 
            the request was successful`, (done) => {

            const errMsg = 'Could not add user';
            spyOn(userDao, 'add').and.throwError(errMsg);

            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });
});
