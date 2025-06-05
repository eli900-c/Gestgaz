const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salaireSchema = new Schema({
  chauffeurId: { type: Schema.Types.ObjectId, ref: 'Chauffeur', required: true },
  moisAnnee: { type: String, required: true }, // Format "MM/YYYY"
  commission: { type: Number, required: true }, // Calculée
  bouteillesVendues: { type: Number, required: true },
  total: { type: Number, required: true }
});

module.exports = mongoose.model('Salaire', salaireSchema);