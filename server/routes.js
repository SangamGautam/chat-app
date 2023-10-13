const express = require('express');
const router = express.Router();
const { io } = require('./server');  // Import io from server.js
const fs = require('fs');
const { io } = require('./server');  // Import io from server.js

// Define the paths to the JSON data files
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const groupsFilePath = path.join(__dirname, 'data', 'groups.json');

// Utility functions to load and save data
const loadData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading data from ${filePath}:`, err);
        return [];
    }
};

const saveData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing data to ${filePath}:`, err);
    }
};

// Load initial data
let users = loadData(usersFilePath);
let groups = loadData(groupsFilePath);

// Authentication Routes
router.post('/auth/register', (req, res) => {
    const { username, password, email } = req.body;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = {
        username,
        password,
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

router.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully.' });
});

router.get('/groups', (req, res) => {
    loadGroups();
    res.json(groups);
});


router.post('/groups', (req, res) => {
    try {
        console.log("Request body:", req.body);  // Log the request body
        const { groupName } = req.body;
        console.log("Extracted groupName:", groupName);  // Log the extracted groupName

        // Check if the group already exists
        const existingGroup = groups.find(group => group.name === groupName);
        if (existingGroup) {
            return res.status(400).json({ message: 'Group already exists.' });
        }

        const newGroup = {
            name: groupName,
            channels: []
        };
        groups.push(newGroup);
        console.log("Updated groups array:", groups);  // Log the updated groups array

        saveGroups();
        res.json({ message: 'Group created successfully.' });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a group by groupName
router.put('/groups/:groupName', (req, res) => {
    const groupName = decodeURIComponent(req.params.groupName);
    const groupToUpdate = groups.find(group => group.name === groupName);

    if (!groupToUpdate) {
        return res.status(404).json({ message: 'Group not found.' });
    }

    // Update the group with the new data
    Object.assign(groupToUpdate, req.body);
    saveGroups();
    res.json({ message: 'Group updated successfully.' });
});


// Delete a group by groupId
router.delete('/groups/:groupName', (req, res) => {
    const groupName = req.params.groupName;
    const groupIndex = groups.findIndex(group => group.name === groupName);

    if (groupIndex === -1) {
        return res.status(404).json({ message: 'Group not found.' });
    }

    groups.splice(groupIndex, 1);
    saveGroups();
    res.json({ message: 'Group deleted successfully.' });
});

router.get('/users', (req, res) => {
    const usersWithoutPasswords = users.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
});

router.get('/groups/:groupName/channels', (req, res) => {
    loadGroups();
    const groupName = decodeURIComponent(req.params.groupName);
    const group = groups.find(g => g.name === groupName);
    if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
    }
    res.json(group.channels);
});

// Create a channel within a specific group

router.post('/groups/:groupName/channels', (req, res) => {
    loadGroups();
    const groupName = decodeURIComponent(req.params.groupName);
    const { channelName } = req.body;
    const group = groups.find(g => g.name === groupName);
    if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
    }
    if (group.channels.includes(channelName)) {
        return res.status(400).json({ message: 'Channel already exists in this group.' });
    }
    group.channels.push(channelName);
    saveGroups();
    res.json({ message: `Channel ${channelName} created successfully for group ${groupName}.` });
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

// Fetch users within a specific group
router.get('/groups/:groupName/users', (req, res) => {
    const groupName = decodeURIComponent(req.params.groupName);
    const groupUsers = users.filter(user => user.groups.includes(groupName));
    res.json(groupUsers);
});

// Endpoint to Create a User
router.post('/users', (req, res) => {
    const { username, email, password, role } = req.body;

    if (!role || !['User', 'GroupAdmin', 'SuperAdmin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid or missing user role.' });
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = {
        username,
        email,
        password,
        id: users.length + 1,
        roles: [role],
        groups: []
    };
    users.push(newUser);
    saveUsers();

    res.json({ message: `User created successfully with role ${role}.` });
});



// Endpoint to Delete a User
router.delete('/users/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent deletion of Super Admin
    if (user.roles.includes('SuperAdmin')) {
        return res.status(403).json({ message: 'Cannot delete Super Admin.' });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    users.splice(userIndex, 1);
    saveUsers();

    res.json({ message: 'User deleted successfully.' });
});


// Endpoint to Create a User by Super Admin
router.post('/admin/create-user', (req, res) => {
    const { username, email, role, password } = req.body; // Extract the password

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = {
        username,
        email,
        password,  
        id: users.length + 1,
        roles: [role || 'User'], 
        groups: []
    };
    users.push(newUser);
    saveUsers();

    res.json({ message: `User created successfully with role ${role || 'User'}.` });
});


// Endpoint to Delete a User by Super Admin
router.delete('/admin/delete-user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
    }

    users.splice(userIndex, 1);
    saveUsers();

    res.json({ message: 'User deleted successfully by Super Admin.' });
});

// New endpoint to fetch user requests
router.get('/user-requests', (req, res) => {
    const usersWithoutPasswords = users.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
});

// Endpoint to request to join a group
router.post('/groups/:groupName/requestToJoin', (req, res) => {
    const groupName = decodeURIComponent(req.params.groupName);
    const group = groups.find(g => g.name === groupName);
    
    if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
    }

    // TODO: Logic to handle the request to join the group
    // This can involve adding the user to a waiting list, sending a notification to group admins, etc.
    // For now, we'll just simulate adding the user to the group's waiting list.
    if (!group.waitingList) {
        group.waitingList = [];
    }
    const userId = req.body.userId; // Assuming the user's ID is sent in the request body
    if (userId && !group.waitingList.includes(userId)) {
        group.waitingList.push(userId);
        saveGroups(); // Save the updated groups data
    }

    res.json({ message: `Request to join group ${groupName} received.` });
});

// Save data before shutting down the server
process.on('exit', () => {
    saveData(usersFilePath, users);
    saveData(groupsFilePath, groups);
});

module.exports = router;
