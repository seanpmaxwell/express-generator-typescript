import SocketIO from 'socket.io';


// Constants
const socketRoomName = 'jet-logger-chat-room';



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
): void {
    // Send a message to the room
    const room = socket.to(socketRoomName);
    room.emit('emit-msg', {
        timestamp: Date.now(),
        content: message,
        senderName,
    });
}


// Export default
export default {
    connectSocketToRm,
    emitMessage
} as const;
