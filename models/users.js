const mongosse = require('mongoose');

const usersSchema = mongosse.Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  surname: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongosse.model('Users')
