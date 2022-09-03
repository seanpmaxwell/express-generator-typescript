import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import SocketIoClient, { Socket as ClientSocket } from 'socket.io-client';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import { pErr } from '@shared/functions';
import { p as chatPaths } from '@routes/chat-router';
import loginAgent from '../support/login-agent';
import { RoomNotFoundError } from '@shared/errors';


// **** Variables **** //

// Paths
const chatPath = '/api/chat',
  connectSocketRmPath = `${chatPath}${chatPaths.connect}`,
  emitMessagePath = `${chatPath}${chatPaths.emit}`;

// Http codes
const { BAD_REQUEST, OK } = StatusCodes;

// Messages
const msgs = {
  connectSuccess: `should return a response with a status of "${OK}" if the user successfully 
    connected to the socket room`,
  connectionFailed: `should return a response with a status of "${RoomNotFoundError.HttpStatus}" 
    if the user did not connect to the socket room`,
  sendMsgSuccess: `should return a response with a status of "${OK}" and the logged-in user's 
    name`,
  sendMsgFailed: `should return a response with a status of "${BAD_REQUEST}" and if the 
    send-message request failed.`,
}


// **** Types **** //

type TReqBody = string | object | undefined;


// **** Tests **** //

describe('chat-router', () => {

  let agent: SuperTest<Test>;
  let socket: ClientSocket;
  let jwtCookie = '';

  // Run before all tests
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

  // Test connect to the socket room
  describe(`"GET - ${connectSocketRmPath}"`, () => {

    const callApi = (socketId: string) => {
      const path = connectSocketRmPath.replace(':socketId', socketId);
      return agent.get(path).set('Cookie', jwtCookie);
    };

    // Connection to the room successful
    it(msgs.connectSuccess, (done) => {
      callApi(socket.id)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          done();
        });
    });

    // Connection to the room failed
    it(msgs.connectionFailed, (done) => {
      callApi('some-bad-socket-id')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(RoomNotFoundError.HttpStatus);
          expect(res.body.error).toBe(RoomNotFoundError.Msg);
          done();
        });
    });
  });

  // Test sending a message
  describe(`"POST - ${emitMessagePath}"`, () => {

    const callApi = (reqBody: TReqBody) => {
      return agent.post(emitMessagePath)
        .set('Cookie', jwtCookie)
        .type('form').send(reqBody);
    };

    // Send message successfull
    it(msgs.sendMsgSuccess, (done) => {
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

    // Send message failed
    it(msgs.sendMsgFailed, (done) => {
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

  // Run after all tests
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
