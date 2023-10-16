const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes');
const mongoose = require('mongoose'); // Import mongoose

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chatApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

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
app.use('/api', routes.router);

// Socket.io setup
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('send message', async (data) => {
        const user = await routes.getUserById(data.sender);
        const username = user ? user.username : `User with ID ${data.sender}`;
        io.to(data.group).emit('chat message', { ...data, username });
    });

    socket.on('send image', (data) => {
        io.to(data.group).emit('chat image', {
            sender: data.sender,
            imageUrl: data.imageUrl,
            // ... any other data you want to send ...
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('join channel', (data) => {
        socket.join(data.group);
        const user = routes.getUserById(data.userId);
        const username = user ? user.username : `User with ID ${data.userId}`;
        io.to(data.group).emit('user joined', `${username} has joined the group ${data.group}`);
    });

    socket.on('leave channel', (data) => {
        socket.leave(data.group);
        const user = routes.getUserById(data.userId);
        const username = user ? user.username : `User with ID ${data.userId}`;
        io.to(data.group).emit('user left', `${username} has left the group ${data.group}`);
    });
});

// Root route handler
app.get('/', (req, res) => {
    res.send('Server with Socket.io!');
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running with Socket.io on port ${PORT}`);
});
