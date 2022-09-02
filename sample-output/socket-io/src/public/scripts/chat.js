// Start
(() => {
  // Setup socket-io main connection
  console.log('Connecting to socket-io');
  const socket = io('http://localhost:3000');
  socket.on('connect', () => {
    socketIo = socket;
    console.log('Socket-io connected');
    // Connect to the room
    connectToRm(socket.id);
    setupSendMsgListener(socket.id)
    receiveMessage(socket);
  });
})();

/**
 * Connect to the socket-io room for the chat window.
 */
function connectToRm(socketId) {
  console.log('Connecting to socket room');
  Http
    .get('/api/chat/connect-socket-room/' + socketId)
    .then(() => {
      console.log('Connected to socket room');
    });
}

/**
 * Send a message.
 */
function setupSendMsgListener(socketId) {
  document.addEventListener('click', (event) => {
    event.preventDefault();
    var ele = event.target;
    // Detect btn click
    if (ele.matches('#send-msg-btn')) {
      const inputEle = document.getElementById('send-msg-input');
      const message = inputEle.value;
      inputEle.value = '';
      // Call API
      Http.post('/api/chat/emit-message', {
        socketId,
        message,
      })
      .then(resp => resp.json())
      .then((resp) => 
        addMessage({
          senderName: resp.senderName,
          timestamp: Date.now(),
          content: message,
        })
      );
    }
  });
}

/**
 * Receive a socket message.
 */
function receiveMessage(socket) {
  socket.on('emit-msg', (msg) => {
    addMessage(msg);
  });
}

/**
 * Get the html content for a single chat message.
 */
function addMessage(msg) {
  const chatWindow = document.getElementById('chat-window');
  const msgEle = `
    <div class="chat-msg">
      <div>
        <span class="msg-name">
          ${msg.senderName}
        </span>
        <span class="msg-timestamp">
          ${moment(msg.timestamp).format('MM/DD/YYYY h:mm:ssa')}
        </span>
      </div>
      <div>
        ${msg.content}
      </div>
    </div>
  `;
  chatWindow.innerHTML += msgEle;
}
