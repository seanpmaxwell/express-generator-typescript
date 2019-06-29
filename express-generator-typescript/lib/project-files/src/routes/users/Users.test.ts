import app from '@server';
import supertest from 'supertest';

import { IUser, User } from '@entities';
import { pErr } from '@shared';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import * as userRouterItems from './Users';

describe('Users Routes', () => {

    const {
        userDao,
        getUsersPath,
        addUserPath,
        updateUserPath,
        deleteUserPath,
    } = userRouterItems;

    const usersFullPath = '/api/users';
    const getUsersFullPath = usersFullPath + getUsersPath;
    const addUsersFullPath = usersFullPath + addUserPath;
    const updateUserFullPath = usersFullPath + updateUserPath;
    const deleteUserFullPath = usersFullPath + deleteUserPath;

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"GET: ${getUsersFullPath}"`, () => {

        it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {

            const users = [
                new User('Sean Maxwell', 'sean.maxwell@gmail.com'),
                new User('John Smith', 'john.smith@gmail.com'),
                new User('Gordan Freeman', 'gordan.freeman@gmail.com'),
            ];

            spyOn(userDao, 'getAll').and.returnValue(Promise.resolve(users));

            agent.get(getUsersFullPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'User' objects
                    const retUsers = res.body.users.map((user: IUser) => {
                        return new User(user);
                    });
                    expect(retUsers).toEqual(users);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

            const errMsg = 'Could not fetch users.';
            spyOn(userDao, 'getAll').and.throwError(errMsg);

            agent.get(getUsersFullPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });

    describe(`"POST: ${addUsersFullPath}"`, () => {

        const {
            userMissingErr,
        } = userRouterItems;

        const callApi = (reqBody: object) => {
            return agent.post(addUsersFullPath).type('form').send(reqBody);
        };

        const userData = {
            user: new User('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {

            spyOn(userDao, 'add').and.returnValue(Promise.resolve());

            agent.post(addUsersFullPath).type('form').send(userData) // pick up here
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${userMissingErr}" and a status
            code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {

            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(userMissingErr);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

            const errMsg = 'Could not add user.';
            spyOn(userDao, 'add').and.throwError(errMsg);

            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });

    describe(`"PUT: ${updateUserFullPath}"`, () => {

        const {
            userUpdateMissingErr,
        } = userRouterItems;

        const callApi = (reqBody: object) => {
            return agent.put(updateUserFullPath).type('form').send(reqBody);
        };

        const userData = {
            user: new User('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

            spyOn(userDao, 'update').and.returnValue(Promise.resolve());

            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${userUpdateMissingErr}" and a
            status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {

            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(userUpdateMissingErr);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

            const updateErrMsg = 'Could not update user.';
            spyOn(userDao, 'update').and.throwError(updateErrMsg);

            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });

    describe(`"DELETE: ${deleteUserFullPath}"`, () => {

        const callApi = (id: number) => {
            return agent.delete(deleteUserFullPath.replace(':id', id.toString()));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

            spyOn(userDao, 'delete').and.returnValue(Promise.resolve());

            callApi(5)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

            const deleteErrMsg = 'Could not delete user.';
            spyOn(userDao, 'delete').and.throwError(deleteErrMsg);

            callApi(1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(deleteErrMsg);
                    done();
                });
        });
    });
});
