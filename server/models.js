const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: String, 
    username: String,
    password: String,
    email: String,
    roles: [String],
    groups: [String],
});

const groupSchema = new mongoose.Schema({
    name: String,
    channels: [String],
});

const User = mongoose.model('User', userSchema);
const Group = mongoose.model('Group', groupSchema);

module.exports = {
    User,
    Group,
};
