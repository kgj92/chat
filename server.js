const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('서버 실행 중');
});

// 방별 메시지 저장
const roomMessages = {};

io.on('connection', (socket) => {

  console.log('사용자 접속');

  // 방 입장
  socket.on('joinRoom', (roomId) => {

    if (!roomId) return;

    socket.join(roomId);

    console.log(`방 입장: ${roomId}`);

    if (!roomMessages[roomId]) {
      roomMessages[roomId] = [];
    }

    // 기존 메시지 전송
    roomMessages[roomId].forEach(msg => {
      socket.emit('chat message', msg);
    });

  });

  // 메시지 수신
  socket.on('chat message', (msg) => {

    if (
      !msg ||
      !msg.roomId ||
      !msg.type ||
      !msg.content
    ) return;

    const roomId = msg.roomId;

    if (!roomMessages[roomId]) {
      roomMessages[roomId] = [];
    }

    roomMessages[roomId].push(msg);

    io.to(roomId).emit('chat message', msg);

    console.log(`[${roomId}] ${msg.content}`);

  });

  socket.on('disconnect', () => {
    console.log('사용자 접속 종료');
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`서버 실행 중 : ${PORT}`);
});