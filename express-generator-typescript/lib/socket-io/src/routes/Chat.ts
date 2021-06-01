import SocketIO from 'socket.io';
import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

const { BAD_REQUEST, OK } = StatusCodes;
const SOCKET_ROOM_NAME = 'jet-logger-chat-room';



/**
 * Connect to socket room.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function connectSocketRm(req: Request, res: Response) {
    // Get the socket
    const io: SocketIO.Server = req.app.get('socketio');
    const socket = io.sockets.sockets.get(req.params.socketId);
    if (!socket) {
        return res.status(BAD_REQUEST).end();
    }
    // Leave room if already connected, and join that socket-id to the room
    socket.leave(SOCKET_ROOM_NAME);
    socket.join(SOCKET_ROOM_NAME)
    // Return
    return res.status(OK).end();
}


/**
 * Emit message.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function emitMessage(req: Request, res: Response) {
    const { sessionUser } = res;
    const { message, socketId } = req.body;
    // Get the socket
    const io: SocketIO.Server = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        return res.status(BAD_REQUEST).end();
    }
    // Send a message to the room
    const room = socket.to(SOCKET_ROOM_NAME);
    room.emit('emit-msg', {
        timestamp: Date.now(),
        content: message,
        senderName: sessionUser.name,
    })
    // Return
    return res.status(OK).json({
        senderName: sessionUser.name,
    });
}
