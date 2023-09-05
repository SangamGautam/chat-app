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

function saveUsers() {
    fs.writeFileSync('./data/users.json', JSON.stringify(users));
}

router.post('/auth/register', (req, res) => {
    const { username, password, email } = req.body;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = {
        username,
        password, // Storing plain text password (not recommended for production)
        email,
        id: users.length + 1,
        roles: ['User'],
        groups: []
    };
    users.push(newUser);
    saveUsers();

    res.json({ message: 'User registered successfully.' });
});

router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

router.get('/groups', (req, res) => {
    res.json([]);
});

router.post('/groups', (req, res) => {
    res.json({ message: 'Group created successfully.' });
});

router.put('/groups/:groupId', (req, res) => {
    res.json({ message: 'Group updated successfully.' });
});

router.delete('/groups/:groupId', (req, res) => {
    res.json({ message: 'Group deleted successfully.' });
});

router.get('/users', (req, res) => {
    const usersWithoutPasswords = users.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
});

router.put('/users/:userId/role', (req, res) => {
    const userId = parseInt(req.params.userId);
    const { role } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.roles = [role];
    saveUsers();

    res.json({ message: 'User role updated successfully.' });
});

module.exports = router;
