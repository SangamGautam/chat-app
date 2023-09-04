const express = require('express');
const router = express.Router();
const fs = require('fs');

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

// Route to register a new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('Username already exists.');
    }

    // Add new user to the users array
    users.push({ username, password });
    saveUsers(); // Save to JSON file

    res.send('User registered successfully.');
});

// Route to login a user
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if user exists and password matches
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(400).send('Invalid username or password.');
    }

    res.send('Logged in successfully.');
});

module.exports = router;
