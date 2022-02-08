import SocketIO from 'socket.io';
import StatusCodes from 'http-status-codes';
import { Router, Request, Response } from 'express';

import chatService from '@services/chat-service';
import { ParamMissingError, RoomNotFoundError } from '@shared/errors';


// Chat router
const router = Router();
const { OK } = StatusCodes;

// Paths
export const p = {
    connect: '/connect-socket-room/:socketId',
    emit: '/emit-message',
} as const;



/**
 * Connect to socket room.
 */
router.get(p.connect, (req: Request, res: Response) => {
    const { socketId } = req.params;
    // Check params
    if (!socketId) {
        throw new ParamMissingError();
    }
    // Get room
    const io: SocketIO.Server = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        throw new RoomNotFoundError();
    }
    // Connect
    chatService.connectSocketToRm(socket);
    // Return
    return res.status(OK).end();
});


/**
 * Send a chat message.
 */
router.post(p.emit, (req: Request, res: Response) => {
    const { sessionUser } = res.locals;
    const { message, socketId } = req.body;
    // Check params
    if (!socketId || !message) {
        throw new ParamMissingError();
    }
    // Get room
    const io: SocketIO.Server = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        throw new RoomNotFoundError();
    }
    // Connect
    chatService.emitMessage(socket, message, sessionUser.name);
    // Return
    return res.status(OK).json({
        senderName: sessionUser.name,
    });
});


// Export router
export default router;
