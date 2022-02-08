import SocketIO from 'socket.io';


const socketRoomName = 'jet-logger-chat-room',
    roomNotFound = 'socket room not found on socket server.'



/**
 * Connect to socket room.
 * 
 * @param socket
 * @returns 
 */
export function connectSocketToRm(socket: SocketIO.Socket): void {
    socket.leave(socketRoomName);
    socket.join(socketRoomName);
}


/**
 * Send a chat message.
 * 
 * @param socket
 * @param message
 * @param senderName
 * @returns 
 */
export function emitMessage(
    socket: SocketIO.Socket,
    message: string,
    senderName: string,
): { error?: string } {
    // Send a message to the room
    const room = socket.to(socketRoomName);
    room.emit('emit-msg', {
        timestamp: Date.now(),
        content: message,
        senderName,
    });
    // Return
    return {};
}


// Export default
export default {
    connectSocketToRm,
    emitMessage
} as const;
