const express = require('express');
const router = express.Router();
const fs = require('fs');

let users = [];
let groups = [];

// Load users from file
function loadUsers() {
    try {
        const data = fs.readFileSync('./data/users.json', 'utf8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading users from JSON file', err);
    }
}

// Load groups from file
function loadGroups() {
    try {
        const groupData = fs.readFileSync('./data/groups.json', 'utf8');
        groups = JSON.parse(groupData);
        groups.forEach(group => {
            if (!group.channels) {
                group.channels = [];
            }
        });
    } catch (err) {
        console.log('Error reading groups from JSON file', err);
    }
}


function saveUsers() {
    try {
        fs.writeFileSync('./data/users.json', JSON.stringify(users));
    } catch (err) {
        console.error('Error writing users to JSON file', err);
    }
}

function saveGroups() {
    try {
        fs.writeFileSync('./data/groups.json', JSON.stringify(groups));
    } catch (err) {
        console.error('Error writing groups to JSON file', err);
    }
}

function getUserById(id) {
    return users.find(user => user.id === id);
}


loadUsers(); // Initial load
loadGroups(); // Initial load

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

// New route to join a group
router.post('/groups/:groupName/join', (req, res) => {
    // Reload groups and users to get the most up-to-date data
    loadGroups();
    loadUsers();

    const groupName = decodeURIComponent(req.params.groupName);
    const group = groups.find(g => g.name === groupName);

    if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
    }

    const userId = req.body.userId;  // Assuming the user's ID is sent in the request body
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.groups) {
        user.groups = [];
    }

    if (user.groups.includes(groupName)) {
        return res.status(200).json({ message: 'User is already a member of this group.' });
    }

    // Add the user to the group
    user.groups.push(groupName);

    saveUsers();  // Save the updated users data

     // Return a success message
    res.json({ message: `Successfully joined the group ${groupName}.` });
});

// Endpoint to let a user leave a group
router.post('/groups/:groupName/leave', (req, res) => {
    // Reload groups and users to get the most up-to-date data
    loadGroups();
    loadUsers();

    const groupName = decodeURIComponent(req.params.groupName);
    const group = groups.find(g => g.name === groupName);

    if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
    }

    const userId = req.body.userId;  // Assuming the user's ID is sent in the request body
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.groups || !user.groups.includes(groupName)) {
        return res.status(400).json({ message: 'User is not a member of this group.' });
    }

    // Remove the group from the user's list of groups
    const groupIndex = user.groups.indexOf(groupName);
    user.groups.splice(groupIndex, 1);

    saveUsers();  // Save the updated users data

    // Return a success message
    res.json({ message: `Successfully left the group ${groupName}.` });
});

module.exports = {
    router,
    getUserById
};
