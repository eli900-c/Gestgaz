const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  role: { type: String, enum: ['controleur', 'admin'], required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
