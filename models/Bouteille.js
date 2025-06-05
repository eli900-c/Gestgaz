const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bouteilleSchema = new Schema({
  typeGaz: { type: String, enum: 'butane', required: true },
  capaciteKg: { type: Number, required: true },
  prixConsigne: { type: Number, required: true },
  prixVente: { type: Number, required: true },
  etat: { type: String, enum: ['pleine', 'vide'], default: 'pleine' },
  stockId: {type: mongoose.Schema.Types.ObjectId,ref: 'Stock', required: false }, // optionnel car les bouteilles peuvent exister indépendamment
  codeBarre: { type: String, unique: true } // Pour scan mobile
});

module.exports = mongoose.model('Bouteille', bouteilleSchema);
