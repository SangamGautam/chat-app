const mongoose = require('mongoose');
const fs = require('fs');
const { User, Group } = require('./models');

async function migrateData() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });

    const userData = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
    const groupData = JSON.parse(fs.readFileSync('./data/groups.json', 'utf-8'));

    for (const user of userData) {
        if (user.id) {
            const idStr = String(user.id);
            // Only use the id from the JSON if it's a valid ObjectId
            if (mongoose.Types.ObjectId.isValid(idStr)) {
                user._id = idStr;
            }
            delete user.id;
        }
        await new User(user).save();
    }

    for (const group of groupData) {
        await new Group(group).save();
    }

    console.log('Data migration complete');
    mongoose.connection.close();
}

migrateData().catch(console.error);
