const Livraison = require('../models/Livraison');
const StockService = require('./StockService');
const Stock = require('../models/Stock');

class LivraisonService {
  /**
   * Création d'une livraison (départ du chauffeur)
   */
  static async creerLivraison({ chauffeurId, camionId, controleurId, bouteillesPleinesDepart }) {
    // Vérifier qu'il n'y a pas déjà une livraison "en cours" pour ce chauffeur
    const livraisonExistante = await Livraison.findOne({ chauffeurId, status: 'en cours' });
    if (livraisonExistante) {
      throw new Error("Ce chauffeur a déjà une livraison en cours.");
    }

    const livraison = new Livraison({
      chauffeurId,
      camionId,
      controleurId,
      bouteillesPleinesDepart,
      status: 'en cours',
    });

    // Déduit le stock de bouteilles pleines
    await StockService.ajusterStockGlobal({ quantite: -bouteillesPleinesDepart, type: 'pleine' });

    await livraison.save();
    return livraison;
  }

  /**
   * Validation retour d'une livraison (retour du chauffeur)
   */
  static async validerRetourLivraison(idLivraison, { bouteillesVidesRetour, bouteillesPleinesRetour, controleurId }) {
    const livraison = await Livraison.findById(idLivraison);
    if (!livraison) throw new Error('Livraison introuvable');
    if (livraison.status !== 'en cours') throw new Error('Livraison déjà validée ou retournée');

    livraison.bouteillesVidesRetour = bouteillesVidesRetour;
    livraison.bouteillesPleinesRetour = bouteillesPleinesRetour;
    livraison.dateRetour = new Date();
    livraison.controleurId = controleurId;
    livraison.status = 'validee';

    await livraison.save();

    // Réintègre les bouteilles pleines non vendues et les bouteilles vides récupérées
    await StockService.ajusterStockGlobal({ quantite: bouteillesPleinesRetour, type: 'pleine' });
    await StockService.ajusterStockGlobal({ quantite: bouteillesVidesRetour, type: 'vide' });

    // Après validation de la livraison
    const stock = await Stock.findOne(); // ou selon ta logique multi-dépôt
    if (stock) {
      // Ajoute les bouteilles vendues
      stock.bouteillesVendues += (livraison.bouteillesPleinesDepart - livraison.bouteillesPleinesRetour);
      // Ajoute les bouteilles perdues (manquantes)
      const manquantes = livraison.bouteillesPleinesDepart - livraison.bouteillesVidesRetour - livraison.bouteillesPleinesRetour;
      stock.bouteillesPerdues += manquantes > 0 ? manquantes : 0;
      await stock.save();
    }

    return livraison;
  }

  /**
   * Calcul des bouteilles vendues
   */
  static async calculerBouteillesVendues(livraisonId) {
    const livraison = await Livraison.findById(livraisonId);
    if (!livraison) throw new Error('Livraison introuvable');
    return livraison.bouteillesPleinesDepart - livraison.bouteillesPleinesRetour;
  }

  /**
   * Vérifie s’il y a des anomalies (ex : trop de bouteilles pleines retournées)
   */
  static async verifierAnomalies(livraisonId) {
    const livraison = await Livraison.findById(livraisonId);
    if (!livraison) throw new Error('Livraison introuvable');

    if (livraison.bouteillesPleinesRetour > 5) {
      return { hasAnomaly: true, message: "Trop de bouteilles pleines retournées !" };
    }

    return { hasAnomaly: false };
  }

  /**
   * Applique une pénalité si des bouteilles sont manquantes
   */
  static async appliquerPenalite(livraisonId) {
    const livraison = await Livraison.findById(livraisonId);
    if (!livraison) throw new Error('Livraison introuvable');

    const manquantes = livraison.bouteillesManquantes;
    if (manquantes <= 0 || livraison.penaliteAppliquee) {
      return livraison;
    }

    const montantPenalite = livraison.penalite;
    livraison.penaliteAppliquee = true;
    await livraison.save();

    console.log(`Pénalité de ${montantPenalite} CFA appliquée pour la livraison ${livraison._id}`);

    // Possibilité : affecter la pénalité au chauffeur, notifier, etc.

    return livraison;
  }
}

module.exports = LivraisonService;
