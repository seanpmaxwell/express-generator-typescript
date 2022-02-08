import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import SocketIoClient, { Socket as ClientSocket } from 'socket.io-client';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import { pErr } from '@shared/functions';
import { p as chatPaths } from '@routes/chat-router';
import loginAgent from '../support/login-agent';
import { RoomNotFoundError } from '@shared/errors';

const { BAD_REQUEST, OK } = StatusCodes;
type TReqBody = string | object | undefined;



describe('chat-router', () => {

    const chatPath = '/api/chat';
    const connectSocketRmPath = `${chatPath}${chatPaths.connect}`;
    const emitMessagePath = `${chatPath}${chatPaths.emit}`;
    let agent: SuperTest<Test>;
    let socket: ClientSocket;
    let jwtCookie = '';


    beforeAll((done) => {
        agent = supertest.agent(app);
        loginAgent.login(agent, (cookie: string) => {
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
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    done();
                });
        });

        it(`should return a response with a status of "${RoomNotFoundError.HttpStatus}" if the
            user did not connect to the socket room`, (done) => {
            // Call api
            callApi('some-bad-socket-id')
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(RoomNotFoundError.HttpStatus);
                    expect(res.body.error).toBe(RoomNotFoundError.Msg);
                    done();
                });
        });
    });


    describe(`"POST - ${emitMessagePath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.post(emitMessagePath).set('Cookie', jwtCookie).type('form').send(reqBody);
        };

        it(`should return a response with a status of "${OK}" and the logged-in user's name`, 
            (done) => {
            // Call api
            callApi({
                socketId: socket.id,
                message: 'How are you today?',
            })
            .end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.senderName).toBe(loginAgent.creds.name);
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
            .end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(RoomNotFoundError.HttpStatus);
                expect(res.body.error).toBe(RoomNotFoundError.Msg);
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
