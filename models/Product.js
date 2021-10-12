const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  stock: {
    type: Number,
    requiere: true,
    trim: true
  },
  price: {
    type: Number,
    requiere: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Product', productSchema);
