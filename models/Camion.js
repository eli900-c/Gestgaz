const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const camionSchema = new Schema({
  plaqueImmatriculation: { type: String, required: true, unique: true },
  capaciteMaxBouteilles: { type: Number, required: true },
  chauffeurAttribue: { type: Schema.Types.ObjectId, ref: 'Chauffeur' }, // Optionnel
  estEnService: { type: Boolean, default: true }
});

module.exports = mongoose.model('Camion', camionSchema);