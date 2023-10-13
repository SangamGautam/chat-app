import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import http from 'http';
import socketIo from 'socket.io';
import routes from './routes';
import socketHandler from './socketHandler';  // Import the socketHandler module

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(bodyParser.json());

app.use(session({
    secret: '9876543210',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// API routes
app.use('/api', routes);

// Root route handler
app.get('/', (req, res) => {
    res.send('Server!');
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

socketHandler(io);  // Initialize socket handler

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, io };  // Export both app and io
