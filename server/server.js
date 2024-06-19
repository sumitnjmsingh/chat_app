const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const User = require('./models/User');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });




mongoose.connect("mongodb+srv://sumitsamsingh1111:22leZS8IyFqIGrAy@cluster0.2roi64i.mongodb.net/chat_web?retryWrites=true&w=majority&appName=Cluster0"

).then(() => console.log('MongoDB connected'))
  .catch(err => console.log("mongodb connection error is:::::",err));

app.use(cors(
    {
        origin: 'https://chat-app-ntj2.vercel.app', 
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type,Authorization'
    }
));
app.use(express.json());

app.get('/',(req,res)=>{
  res.send("Hello");
})
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password:hashedPassword });
  
  await user.save();
  
 return res.json({msg:'User registered'});
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  


  if (user && await bcrypt.compare(password, user.password)) {
    
    const token = jwt.sign({ username: user.username }, 'sumit', { expiresIn: '1h' });

    res.json({ token });


  } else {
    res.status(401).send('Invalid credentials');
  }
});


io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, 'sumit', (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
})
.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join', ({ name, room }) => {
    const {  user } = addUser({ id: socket.id, name, room });
    
    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
  });

  socket.on('sendMessage', (message) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    
    
    
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(5000, () => console.log("Server has started on port 5000"));

