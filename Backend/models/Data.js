const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  email: { type: String, required: true },
  letterTitle: { type: String, required: true },
  letterBody: { type: String, required: true },
  letterSender: { type: String, required: true },
  sharePublicly: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Data', dataSchema);
