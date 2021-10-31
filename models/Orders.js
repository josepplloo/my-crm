const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orders: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'PROCESSING', 'DELIVERED'],
    default: 'PENDING'
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Order', orderSchema);
