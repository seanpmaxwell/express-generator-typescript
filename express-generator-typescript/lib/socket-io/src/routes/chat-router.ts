import SocketIO from 'socket.io';
import StatusCodes from 'http-status-codes';
import { Router, Request, Response } from 'express';

import chatService from '@services/chatService';
import { errors } from '@shared/constants';


// Chat router
const router = Router();
const { BAD_REQUEST, OK } = StatusCodes;
const roomNotFound = 'socket room not found on socket server.'

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
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissing,
        })
    }
    // Get room
    const io: SocketIO.Server = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        return res.status(BAD_REQUEST).json({
            error: roomNotFound,
        })
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
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissing,
        })
    }
    // Get room
    const io: SocketIO.Server = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        return res.status(BAD_REQUEST).json({
            error: roomNotFound,
        })
    }
    // Connect
    const { error } = chatService.emitMessage(socket, message, sessionUser.name);
    if (!!error) {
        return res.status(BAD_REQUEST).json({error});
    }
    // Return
    return res.status(OK).json({
        senderName: sessionUser.name,
    });
});


// Export router
export default router;
