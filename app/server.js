
// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

let numUsers = 0;

io.on('connection', (socket) => {

  var userName = '';

  let addedUser = false;
  console.log('client connected to the server!');

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    
    const messageData = JSON.parse(data)
    const messageContent = messageData.messageContent
    const roomName = messageData.roomName
	const messageTime = messageData.messageTime
	userName = messageData.userName

    const chatData = {
      userName : userName,
      messageContent : messageContent,
      roomName : roomName,
	  messageTime : messageTime
    }

    socket.to(roomName).emit('updateChat',JSON.stringify(chatData))

    // we tell the client to execute 'new message'
    // socket.broadcast.emit('updateChat',{
    //   username: data.username,
    //   message: data.messageContent,
    //   roomName: data.roomName
    // });
	
	console.log('message: %s', data);	
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username, roomName) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    socket.join(roomName);
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      userName: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

	console.log('client disconnected from the server!');

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        userName: socket.username,
        numUsers: numUsers
      });
    }
  });
});
