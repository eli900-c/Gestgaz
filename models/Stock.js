const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  quantitePleine: { type: Number, default: 0 },
  quantiteVide: { type: Number, default: 0 },
  seuilAlerte: { type: Number },
  bouteillesVendues: { type: Number, default: 0 }, // ➕ total vendues
  bouteillesPerdues: { type: Number, default: 0 }  // ➕ total perdues
});

// Virtuel : total = pleine + vide
StockSchema.virtual('quantiteTotale').get(function () {
  return this.quantitePleine + this.quantiteVide;
});

// Pour que les virtuels soient visibles dans les JSON
StockSchema.set('toJSON', { virtuals: true });
StockSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Stock', StockSchema);
