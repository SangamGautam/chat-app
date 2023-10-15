const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(bodyParser.json());

// Use the session middleware
app.use(session({
    secret: '9876543210',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// API routes
app.use('/api', routes);

// Socket.io setup
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join group', (group) => {
        socket.join(group);
        io.to(group).emit('user joined', `A user has joined the group ${group}`);
    });

    socket.on('leave group', (group) => {
        socket.leave(group);
        io.to(group).emit('user left', `A user has left the group ${group}`);
    });

    // Updated section
    socket.on('send message', (data) => {
        io.to(data.group).emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Root route handler
app.get('/', (req, res) => {
    res.send('Server with Socket.io!');
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running with Socket.io on port ${PORT}`);
});
