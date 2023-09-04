const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const routes = require('./routes');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API routes
app.use('/api', routes);  // Prefix all routes with /api

// Load users from JSON file on startup
let users = [];
try {
    const data = fs.readFileSync('./data/users.json', 'utf8');
    users = JSON.parse(data);
} catch (err) {
    console.log('Error reading users from JSON file', err);
}

// Save users to JSON file
function saveUsers() {
    fs.writeFileSync('./data/users.json', JSON.stringify(users));
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
