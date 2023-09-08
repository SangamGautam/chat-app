const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = express();
const routes = require('./routes');

// Middleware
app.use(cors({
    origin: 'http://localhost:4200', // Adjust this to your frontend's origin
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

// Root route handler
app.get('/', (req, res) => {
    res.send('Server!');
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
