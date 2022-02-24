import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import userRepo from '@repos/user-repo';
import User, { IUser } from '@models/user-model';
import { pErr } from '@shared/functions';
import { p as userPaths } from '@routes/user-router';
import loginAgent from '../support/login-agent';
import { ParamMissingError, UserNotFoundError } from '@shared/errors';

type TReqBody = string | object | undefined;


describe('user-router', () => {

    const usersPath = '/api/users';
    const getUsersPath = `${usersPath}${userPaths.get}`;
    const addUsersPath = `${usersPath}${userPaths.add}`;
    const updateUserPath = `${usersPath}${userPaths.update}`;
    const deleteUserPath = `${usersPath}${userPaths.delete}`;

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;

    let agent: SuperTest<Test>;
    let jwtCookie: string;

    beforeAll((done) => {
        agent = supertest.agent(app);
        loginAgent.login(agent, (cookie: string) => {
            jwtCookie = cookie;
            done();
        });
    });


    /***********************************************************************************
     *                                    Test Get
     **********************************************************************************/

     describe(`"GET:${getUsersPath}"`, () => {

        const callApi = () => {
            return agent.get(getUsersPath).set('Cookie', jwtCookie);
        };


        it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // Setup Dummy Data
            const users = [
                User.new('Sean Maxwell', 'sean.maxwell@gmail.com'),
                User.new('John Smith', 'john.smith@gmail.com'),
                User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
            ];
            spyOn(userRepo, 'getAll').and.returnValue(Promise.resolve(users));
            // Call API
            callApi()
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'User' objects
                    const respUsers = res.body.users;
                    const retUsers: IUser[] = respUsers.map((user: IUser) => {
                        return User.copy(user);
                    });
                    expect(retUsers).toEqual(users);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });


        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            // Setup Dummy Data
            const errMsg = 'Could not fetch users.';
            spyOn(userRepo, 'getAll').and.throwError(errMsg);
            // Call API
            callApi()
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    describe(`"POST:${addUsersPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.post(addUsersPath).set('Cookie', jwtCookie).type('form').send(reqBody);
        };

        const userData = {
            user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };


        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            spyOn(userRepo, 'add').and.returnValue(Promise.resolve());
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });


        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a status
            code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });


        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup Dummy Response
            const errMsg = 'Could not add user.';
            spyOn(userRepo, 'add').and.throwError(errMsg);
            // Call API
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    describe(`"PUT:${updateUserPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.put(updateUserPath).set('Cookie', jwtCookie).type('form').send(reqBody);
        };
        const userData = {
            user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(userRepo, 'update').and.returnValue(Promise.resolve());
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a
            status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
            and a status code of "${UserNotFoundError.HttpStatus}" if the id was not 
            found.`, (done) => {
            // Call api
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(UserNotFoundError.HttpStatus);
                    expect(res.body.error).toBe(UserNotFoundError.Msg);
                    done();
                });
        });


        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            // Setup Dummy Data
            const updateErrMsg = 'Could not update user.';
            spyOn(userRepo, 'update').and.throwError(updateErrMsg);
            // Call API
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });


    describe(`"DELETE:${deleteUserPath}"`, () => {

        const callApi = (id: number) => {
            const path = deleteUserPath.replace(':id', id.toString());
            return agent.delete(path).set('Cookie', jwtCookie);
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(userRepo, 'delete').and.returnValue(Promise.resolve());
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            callApi(5)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
            and a status code of "${UserNotFoundError.HttpStatus}" if the id was not 
            found.`, (done) => {
            // Call api
            callApi(-1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(UserNotFoundError.HttpStatus);
                    expect(res.body.error).toBe(UserNotFoundError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup Dummy Response
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            const deleteErrMsg = 'Could not delete user.';
            spyOn(userRepo, 'delete').and.throwError(deleteErrMsg);
            // Call API
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
