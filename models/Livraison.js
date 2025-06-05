const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const livraisonSchema = new Schema({
  chauffeurId: { type: Schema.Types.ObjectId, ref: 'Chauffeur', required: true },
  camionId: { type: Schema.Types.ObjectId, ref: 'Camion', required: true },
  controleurId: { type: Schema.Types.ObjectId, ref: 'User' }, // Qui a validé
  dateDepart: { type: Date, default: Date.now },
  dateRetour: Date,
  bouteillesPleinesDepart: { type: Number, required: true },
  bouteillesVidesRetour: { type: Number, default: 0 }, // Bouteilles vides récupérées
  bouteillesPleinesRetour: { type: Number, default: 0 }, // Non vendues
  anomalies: [{ type: String }],
  status: {type: String,enum: ['en cours', 'retournee', 'validee'], default: 'en cours'},
  isSynced: { type: Boolean, default: true } ,// Pour mode hors ligne
  penaliteAppliquee: { type: Boolean, default: false }

});



// ➕ Virtuel : bouteilles manquantes = bouteilles pleines départ - bouteilles vides retour - bouteilles pleines retour
livraisonSchema.virtual('bouteillesManquantes').get(function () {
  const retourTotal = this.bouteillesVidesRetour + this.bouteillesPleinesRetour;
  const manquantes = this.bouteillesPleinesDepart - retourTotal;
  return manquantes > 0 ? manquantes : 0;
});

// ➕ Virtuel : pénalité = manquantes × prix consigne (ex. 5000 CFA)
livraisonSchema.virtual('penalite').get(function () {
  const prixConsigne = 5000; // Prix consigne fixe, peut être remplacé par une référence à un modèle Bouteille si nécessaire
  return this.bouteillesManquantes * prixConsigne;
});

// ➕ Middleware : ajouter une anomalie automatique si perte détectée
livraisonSchema.pre('save', function(next) {
  // Supprimer anomalies sur bouteilles avant recalcul
  this.anomalies = this.anomalies.filter(a => !a.includes('bouteille'));

  const retourTotal = this.bouteillesVidesRetour + this.bouteillesPleinesRetour;
  const manquantes = this.bouteillesPleinesDepart - retourTotal;

  if (manquantes > 0) {
    this.anomalies.push(`⚠️ ${manquantes} bouteille(s) manquante(s)`);
  }

  next();
});



// ➕ Rendre les virtuels visibles dans JSON
livraisonSchema.set('toJSON', { virtuals: true });
livraisonSchema.set('toObject', { virtuals: true });






module.exports = mongoose.model('Livraison', livraisonSchema);




