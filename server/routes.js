const express = require('express');
const multer  = require('multer');
const { User, Group } = require('./models'); // Import your MongoDB models
const router = express.Router();

// Set up multer to store uploaded images in the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

// New route for uploading profile pictures
router.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const imagePath = req.file.path;

    // Update the user's data with the new image path
    await User.findByIdAndUpdate(userId, { profilePicture: imagePath });

    // Build the imageUrl based on your server's configuration
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    res.json({ message: 'Profile picture updated successfully.', imageUrl });
  } catch (error) {
    res.status(500).send(error.message);
  }
});



// route to upload image in chat
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Use the file information to save the image path to your database,
    // or handle the file as needed
    const imagePath = req.file.path;
    res.json({ message: 'Image uploaded successfully.', imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Register a new user
router.post('/auth/register', async (req, res) => {
  console.log(req.body);
    try {
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }
        const newUser = new User({
            username,
            password, // Hash this password before saving in production
            email,
            roles: ['User'],
            groups: []
        });
        await newUser.save();
        res.json({ message: 'User registered successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    
});

router.post('/auth/login', async (req, res) => {
  console.log(req.body);
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username, password });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password.' });
      }
  
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/auth/logout', (req, res) => {
  console.log(req.body);
    req.session.destroy();
    res.json({ message: 'Logged out successfully.' });
});

router.get('/groups', async (req, res) => {
  console.log(req.body);
    try {
      const groups = await Group.find({});
      res.json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/groups', async (req, res) => {
  console.log(req.body);
    const { groupName } = req.body;
  
    try {
      const existingGroup = await Group.findOne({ name: groupName });
      if (existingGroup) {
        return res.status(400).json({ message: 'Group already exists.' });
      }
  
      const newGroup = new Group({
        name: groupName,
        channels: []
      });
  
      await newGroup.save();
      res.json({ message: 'Group created successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/groups/:groupName', async (req, res) => {
  console.log(req.body);
    const groupName = decodeURIComponent(req.params.groupName);
  
    try {
      const updatedGroup = await Group.findOneAndUpdate(
        { name: groupName },
        req.body,
        { new: true }
      );
  
      if (!updatedGroup) {
        return res.status(404).json({ message: 'Group not found.' });
      }
  
      res.json({ message: 'Group updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

  router.delete('/groups/:groupName', async (req, res) => {
    console.log(req.body);
    const groupName = req.params.groupName;
  
    try {
      const deletedGroup = await Group.findOneAndDelete({ name: groupName });
  
      if (!deletedGroup) {
        return res.status(404).json({ message: 'Group not found.' });
      }
  
      res.json({ message: 'Group deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/users', async (req, res) => {
  console.log(req.body);
    try {
      const users = await User.find({}, '-password');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/groups/:groupName/channels', async (req, res) => {
  console.log(req.body);
    const groupName = decodeURIComponent(req.params.groupName);
  
    try {
      const group = await Group.findOne({ name: groupName });
      if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
      }
      res.json(group.channels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/groups/:groupName/channels', async (req, res) => {
  console.log(req.body);
    const groupName = decodeURIComponent(req.params.groupName);
    const { channelName } = req.body;
  
    try {
      const group = await Group.findOne({ name: groupName });
      if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
      }
  
      if (group.channels.includes(channelName)) {
        return res.status(400).json({ message: 'Channel already exists in this group.' });
      }
  
      group.channels.push(channelName);
      await group.save();
      res.json({ message: `Channel ${channelName} created successfully for group ${groupName}.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/users/:userId/role', async (req, res) => {
  console.log(req.body);
    const userId = req.params.userId;
    const { role } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(userId, { roles: [role] }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.json({ message: 'User role updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/groups/:groupName/users', async (req, res) => {
  console.log(req.body);
    const groupName = decodeURIComponent(req.params.groupName);
  
    try {
      const users = await User.find({ groups: { $in: [groupName] } }, '-password');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/users', async (req, res) => {
  console.log(req.body);
    const { username, email, password, role } = req.body;
  
    if (!role || !['User', 'GroupAdmin', 'SuperAdmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid or missing user role.' });
    }
  
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
  
    const newUser = new User({
      username,
      email,
      password,
      roles: [role],
      groups: []
    });
    
    await newUser.save();
    res.json({ message: `User created successfully with role ${role}.` });
});

router.delete('/users/:userId', async (req, res) => {
  console.log(req.body);
    const userId = req.params.userId;
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    if (user.roles.includes('SuperAdmin')) {
      return res.status(403).json({ message: 'Cannot delete Super Admin.' });
    }
  
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully.' });
});

router.post('/admin/create-user', async (req, res) => {
  console.log(req.body);
  const { username, email, role, password } = req.body;
  
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists.' });
  }
  
  const newUser = new User({
    username,
    email,
    password,
    roles: [role || 'User'],
    groups: []
  });
  
  newUser.save((error, savedUser) => {
    if (error) {
        console.error('Error saving user:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
    console.log('User saved successfully:', savedUser);
    res.json({ message: `User created successfully with role ${role || 'User'}.` });
  });
});


router.delete('/admin/delete-user/:userId', async (req, res) => {
  console.log(req.body);
    const userId = req.params.userId;
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully by Super Admin.' });
});

router.get('/user-requests', async (req, res) => {
  console.log(req.body);
    try {
      const users = await User.find({}, '-password');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/groups/:groupName/join', async (req, res) => {
  console.log(req.body);
    const groupName = decodeURIComponent(req.params.groupName);
    const userId = req.body.userId;
  
    const group = await Group.findOne({ name: groupName });
    const user = await User.findById(userId);
  
    if (!group || !user) {
      return res.status(404).json({ message: 'Group or User not found.' });
    }
  
    if (!user.groups.includes(groupName)) {
      user.groups.push(groupName);
      await user.save();
    }
  
    res.json({ message: `Successfully joined the group ${groupName}.` });
});

router.post('/groups/:groupName/leave', async (req, res) => {
  console.log(req.body);
    const groupName = decodeURIComponent(req.params.groupName);
    const userId = req.body.userId;
  
    const group = await Group.findOne({ name: groupName });
    const user = await User.findById(userId);
  
    if (!group || !user) {
      return res.status(404).json({ message: 'Group or User not found.' });
    }
  
    const groupIndex = user.groups.indexOf(groupName);
    if (groupIndex !== -1) {
      user.groups.splice(groupIndex, 1);
      await user.save();
    }
  
    res.json({ message: `Successfully left the group ${groupName}.` });
});

router.put('/users/:userId/role', async (req, res) => {
  console.log(req.body);
    const userId = req.params.userId;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.roles = [role];
    await user.save();

    res.json({ message: 'User role updated successfully.' });
});

router.get('/groups/:groupName/users', async (req, res) => {
  console.log(req.body);
    const groupName = decodeURIComponent(req.params.groupName);

    const usersInGroup = await User.find({ groups: groupName });
    if (!usersInGroup) {
        return res.status(404).json({ message: 'No users found in this group.' });
    }

    res.json(usersInGroup);
});

module.exports = {
    router,
    getUserById: async (_id) => await User.findById(_id)
};

  
  
  
  