import SocketIO from 'socket.io';
import StatusCodes from 'http-status-codes';
import { Router, Request, Response } from 'express';

import { ParamMissingError, RoomNotFoundError } from '@shared/errors';
import { IReq } from 'src/types/express';


// **** Variables **** //

// Chat router
const router = Router();
const { OK } = StatusCodes;

// Paths
export const p = {
  connect: '/connect-socket-room/:socketId',
  emit: '/emit-message',
} as const;

export const socketRoomName = 'jet-logger-chat-room';


// **** Types **** //

interface IPostMsg {
  message: string; 
  socketId: string;
}


// **** Routes **** //

/**
 * Connect to socket room.
 */
router.get(p.connect, async (req: Request, res: Response) => {
  const { socketId } = req.params;
  // Check params
  if (!socketId) {
    throw new ParamMissingError();
  }
  // Get socket
  const socket = getSocket(req, socketId);
  // Connect
  await Promise.all([
    socket.leave(socketRoomName),
    socket.join(socketRoomName),
  ]);
  // Return
  return res.status(OK).end();
});

/**
 * Send a chat message.
 */
router.post(p.emit, (req: IReq<IPostMsg>, res: Response) => {
  const { sessionUser } = res.locals;
  const { message, socketId } = req.body;
  // Check params
  if (!socketId || !message) {
    throw new ParamMissingError();
  }
  // Get socket
  const socket = getSocket(req, socketId);
  // Connect
  const room = socket.to(socketRoomName);
  room.emit('emit-msg', {
    timestamp: Date.now(),
    content: message,
    senderName: sessionUser.name,
  });
  // Return
  return res.status(OK).json({
    senderName: sessionUser.name,
  });
});


// **** Helpers **** //

/**
 * Get the socket from the Express request object.
 */
function getSocket(req: Request, socketId: string): SocketIO.Socket {
  const io = req.app.get('socketio') as SocketIO.Server;
  const socket = io.sockets.sockets.get(socketId);
  if (!socket) {
    throw new RoomNotFoundError();
  }
  return socket;
}


// **** Export default **** //

export default router;
