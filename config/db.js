const mongoose = require('mongoose');
require('dotenv').config({
  path: '.env'
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STR, {
      useNewURLParser: true,
      useUnifiedTopology: true
    });
    console.log(`📙 🍃 MongoDB ready`);
  } catch (error) {
    console.error('The stack trace is:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
