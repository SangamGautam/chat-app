const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Successfully connected to MongoDB');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

testConnection();
