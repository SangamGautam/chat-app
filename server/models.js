const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // _id: String,
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    roles: { type: [String], default: [] },
    groups: { type: [String], default: [] },
}, { timestamps: true });  // Adding timestamps for debugging

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    channels: { type: [String], default: [] },
});

const User = mongoose.model('User', userSchema);
const Group = mongoose.model('Group', groupSchema);

module.exports = {
    User,
    Group,
};
