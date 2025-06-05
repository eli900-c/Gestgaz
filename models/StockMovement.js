// models/MouvementStock.js
const mongoose = require("mongoose");

const mouvementStockSchema = new mongoose.Schema({
  type: { type: String, enum: ['entrée', 'sortie'], required: true },
  date: { type: Date, default: Date.now },
  bouteilleType: { type: String, enum: ['pleine', 'vide'], required: true },
  quantite: { type: Number, required: true },
  description: String,
  chauffeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chauffeur' },
  camionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camion' },
  controleurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  livraisonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livraison' }
});

module.exports = mongoose.model("MouvementStock", mouvementStockSchema);
