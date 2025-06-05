const Salaire = require('../models/Salaire');
const Livraison = require('../models/Livraison');
const Chauffeur = require('../models/Chauffeur');

class SalaireService {
  static async calculerSalaire(chauffeurId, moisAnnee) {
    // 1. Calculer la plage de dates
    const startDate = new Date(`${moisAnnee}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // 2. Obtenir les livraisons validées du chauffeur sur la période
    const livraisons = await Livraison.find({
      chauffeurId,
      dateDepart: {
        $gte: startDate,
        $lt: endDate,
      },
      status: 'validee',
    });

    // 3. Calculer le nombre total de bouteilles vendues
    const bouteillesVendues = livraisons.reduce(
      (total, liv) => total + (liv.bouteillesPleinesDepart - liv.bouteillesPleinesRetour),
      0
    );

    // 4. Calculer le total des pénalités sur les livraisons et préparer le détail
    const penalitesDetails = livraisons
      .filter(liv => (liv.penalite || 0) > 0)
      .map(liv => ({
        livraisonId: liv._id,
        montant: liv.penalite,
        date: liv.dateRetour,
      }));

    const totalPenalites = penalitesDetails.reduce(
      (total, p) => total + (p.montant || 0),
      0
    );

    // 5. Obtenir le chauffeur
    const chauffeur = await Chauffeur.findById(chauffeurId);
    if (!chauffeur) throw new Error('Chauffeur non trouvé');
    if (chauffeur.tauxCommission == null) throw new Error('Taux de commission manquant');

    // 6. Calculer la commission totale
    const commission = chauffeur.tauxCommission;
    const salaireBrut = bouteillesVendues * commission;

    // 7. Calculer le salaire net (commission - pénalités)
    const total = salaireBrut - totalPenalites;

    // 8. Sauvegarder ou mettre à jour le salaire
    // Optionnel : vérifier si salaire déjà calculé pour ce mois/chauffeur, et faire update sinon save
    let salaire = await Salaire.findOne({ chauffeurId, moisAnnee });
    if (salaire) {
      salaire.commission = commission;
      salaire.bouteillesVendues = bouteillesVendues;
      salaire.total = total;
      await salaire.save();
    } else {
      salaire = new Salaire({
        chauffeurId,
        moisAnnee,
        commission,
        bouteillesVendues,
        total,
      });
      await salaire.save();
    }

    // ➕ Peupler le chauffeur pour avoir son nom/prenom
    await salaire.populate({
      path: 'chauffeurId',
      select: 'nom prenom'
    });

    // Retourne aussi le détail des pénalités
    return {
      salaire: salaire.toObject(),
      penalites: penalitesDetails
    };
  }
}

module.exports = SalaireService;
