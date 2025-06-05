const mongoose = require('mongoose');

const chauffeurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  date_embauche: { type: Date, default: Date.now },
  actif: { type: Boolean, default: true },
  tauxCommission: { type: Number, default: 500 }
});

module.exports = mongoose.model('Chauffeur', chauffeurSchema);
