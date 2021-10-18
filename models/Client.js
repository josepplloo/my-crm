const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
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
  company: {
    type: String,
    require: true,
    trim: true
  },
  telephone: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Client', clientSchema);
