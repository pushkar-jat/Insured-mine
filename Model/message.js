const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: String,
  postTime: Date
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
