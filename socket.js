const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => 
{
  const io = SocketIO(server, { path: '/socket.io' });

  app.set('io', io);
  
  const room = io.of('/main/room');
  const chat = io.of('/main/chat');

  io.use((socket, next) => 
  {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on('connection', (socket) => 
  {
    console.log('room 네임스페이스에 접속');
    
    socket.on('disconnect', () => 
    {
      console.log('room 네임스페이스 접속 해제');
    });

  });

  chat.on('connection', (socket) => 
  {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    
    socket.join(roomId);
    
    socket.to(roomId).emit('join', 
    {
      user: 'system',
      chat: `${req.session.color}님이 채팅방에 참여하였습니다.");`,
    });

    socket.on('test', ()=>
    {
        console.log('===================================>test!');
    });

    /*서버 측 이벤트*/
    socket.on('chat message', function(msg)
    {     
        socket.emit('my message', 
        {
            message: msg
        });

        socket.broadcast.to(roomId).emit('chat message', 
        {
            message: msg
        });
    });

    socket.on('disconnect', () => 
    {
      console.log('chat 네임스페이스 접속 해제');
      console.log(roomId);
      socket.leave(roomId);
      
      const currentRoom = socket.adapter.rooms[roomId];
      console.log(currentRoom);

      const userCount = currentRoom ? currentRoom.length : 0;
      console.log(userCount);

      if (userCount === 0) 
      {
          axios.delete(`http://localhost:8001/main/room/${roomId}`)
          .then(() => 
          {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => 
          {
            console.log('방 제거 요청 실패');
            // console.error(error);
          });
      } 
      else 
      {
        socket.to(roomId).emit('exit', 
        {
          user: 'system',
          chat: `${req.session.color}님이 채팅방에서 나갔습니다.");`,
        });
      }
    });
  });
};


// module.exports = (server, app, sessionMiddleware) => 
// {

//     const io = SocketIO(server, { path: '/socket.io' });

//     app.set('io', io);
    
//     const room = io.of('/main/room');
//     const chat = io.of('/main/chat');

//     // usernames which are currently connected to the chat
//     var usernames = {};

//     // rooms which are currently available in chat
//     var rooms = ['room1','room2','room3'];
//     var room_cnt = rooms.length;

// io.sockets.on('connection', function (socket) 
// {

// 	// when the client emits 'adduser', this listens and executes
//     socket.on('adduser', function(username)
//     {
//       // store the username in the socket session for this client
//       socket.username = username;
//       // store the room name in the socket session for this client
//       socket.room = 'room1';
//       // add the client's username to the global list
//       usernames[username] = username;
//       // send client to room 1
//       socket.join('room1');
//       // echo to client they've connected
//       socket.emit('updatechat', 'SERVER', 'you have connected to room1');
//       // echo to room 1 that a person has connected to their room
//       socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
//       socket.emit('updaterooms', rooms, 'room1');
//     });
    
//     socket.on('create', function()
//     {
//       var newroom = rooms.length+1;
//       rooms[rooms.length] = `room${newroom}`;
//       socket.emit('updaterooms', rooms, newroom);
//     });
// 	// when the client emits 'sendchat', this listens and executes
//     socket.on('sendchat', function (data) 
//     {
//       // we tell the client to execute 'updatechat' with 2 parameters
//       io.sockets.in(socket.room).emit('updatechat', socket.username, data);
// 	  });

//     socket.on('switchRoom', function(newroom)
//     {
//       // leave the current room (stored in session)
//       socket.leave(socket.room);
//       // join new room, received as function parameter
//       socket.join(newroom);
//       socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
//       // sent message to OLD room
//       socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
//       // update socket session room title
//       socket.room = newroom;
//       socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
//       socket.emit('updaterooms', rooms, newroom);
// 	});

// 	// when the user disconnects.. perform this
//     socket.on('disconnect', function()
//     {
// 		// remove the username from global usernames list
// 		delete usernames[socket.username];
// 		// update list of users in chat, client-side
// 		io.sockets.emit('updateusers', usernames);
// 		// echo globally that this client has left
// 		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
// 		socket.leave(socket.room);
// 	});
// })

// };


