import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import SocketIoClient, { Socket as ClientSocket } from 'socket.io-client';
import { SuperTest, Test } from 'supertest';

import app from '@server';
import { IReqBody, IResponse } from 'spec/support/types';
import { pErr } from '@shared/functions';
import { login, USER_NAME } from '../support/LoginAgent';

const { BAD_REQUEST, OK } = StatusCodes;



describe('ChatRouter', () => {

    const chatPath = '/api/chat';
    const connectSocketRmPath = `${chatPath}/connect-socket-room/:socketId`;
    const emitMessagePath = `${chatPath}/emit-message`;
    let agent: SuperTest<Test>;
    let socket: ClientSocket;
    let jwtCookie = '';


    beforeAll((done) => {
        agent = supertest.agent(app);
        login(agent, (cookie: string) => {
            const url = agent.get('/').url;
            jwtCookie = cookie;
            socket = SocketIoClient(url, {
                reconnectionDelay: 0,
                forceNew: true,
            });
            socket.on('connect', async () => {
                console.log('socket connected');
                done();
            });
            socket.on('disconnect', () => {
                console.log('socket disconnected');
            });
        });
    });


    describe(`"GET - ${connectSocketRmPath}"`, () => {

        const callApi = (socketId: string) => {
            const path = connectSocketRmPath.replace(':socketId', socketId);
            return agent.get(path).set('Cookie', jwtCookie);
        };

        it(`should return a response with a status of "${OK}" if the user successfully connected
            to the socket room`, (done) => {
            // Call api
            callApi(socket.id)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    done();
                });
        });

        it(`should return a response with a status of "${BAD_REQUEST}" if the user did not
            connect to the socket room`, (done) => {
            // Call api
            callApi('some-bad-socket-id')
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    done();
                });
        });
    });


    describe(`"POST - ${emitMessagePath}"`, () => {

        const callApi = (reqBody: IReqBody) => {
            return agent.post(emitMessagePath).set('Cookie', jwtCookie).type('form').send(reqBody);
        };

        it(`should return a response with a status of "${OK}" and the logged-in user's name`, 
            (done) => {
            // Call api
            callApi({
                socketId: socket.id,
                message: 'How are you today?',
            })
            .end((err: Error, res: IResponse) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.senderName).toBe(USER_NAME);
                done();
            });
        });

        it(`should return a response with a status of "${BAD_REQUEST}" and if the send-message 
            request failed.`, (done) => {
            // Call api
            callApi({
                socketId: 'Some bad socket id',
                message: 'How are you today?',
            })
            .end((err: Error, res: IResponse) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.senderName).toBeFalsy();
                done();
            });
        });
    });


    afterAll((done) => {
        // Cleanup
        if (socket.connected) {
            console.log('socket disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeAll, 
            // socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });
});
