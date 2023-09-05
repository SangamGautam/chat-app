const fs = require('fs');
const path = require('path');

exports.login = (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/extendedUsers.json'), 'utf-8'));

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Here you can generate a token if you're using JWT or similar
        res.status(200).json({ status: 'success', message: 'Logged in successfully' });
    } else {
        res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
    }
};

exports.register = (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/extendedUsers.json'), 'utf-8'));

    if (users.some(u => u.username === username)) {
        return res.status(400).json({ status: 'fail', message: 'Username already exists' });
    }

    users.push({ username, password });

    fs.writeFileSync(path.join(__dirname, '../data/extendedUsers.json'), JSON.stringify(users));

    res.status(201).json({ status: 'success', message: 'Registered successfully' });
};
