const Livraison = require('../models/Livraison');
const LivraisonService = require('../services/LivraisonService');
const MouvementStock = require('../models/StockMovement');

class LivraisonController {
  // Créer une nouvelle livraison
  static async createLivraison(req, res) {
    try {
      const {
        chauffeurId,
        camionId,
        controleurId,
        bouteillesPleinesDepart,
      } = req.body;

      // ✅ Validation d'entrée
      if (!chauffeurId || !camionId || !controleurId || bouteillesPleinesDepart == null) {
        return res.status(400).json({ message: "Champs requis manquants ou invalides" });
      }

      const livraison = await LivraisonService.creerLivraison({
        chauffeurId,
        camionId,
        controleurId,
        bouteillesPleinesDepart
      });

      console.log(`[INFO] Livraison créée: ${livraison._id}`);

      // Enregistrer le mouvement de sortie
      await MouvementStock.create({
        type: "sortie",
        bouteilleType: "pleine",
        quantite: bouteillesPleinesDepart,
        description: "Chargement pour livraison",
        chauffeurId,
        camionId,
        controleurId,
        livraisonId: livraison._id,
      });

      console.log(`[INFO] Mouvement de stock (sortie) enregistré pour livraison ${livraison._id}`);



      res.status(201).json(livraison);
    } catch (error) {
      console.error("[ERREUR] createLivraison:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  // Valider le retour d'une livraison
  static async validateLivraison(req, res) {
  try {
    const { livraisonId, bouteillesVidesRetour, bouteillesPleinesRetour, controleurId } = req.body;

    // Vérification des champs requis
    if (
      !livraisonId ||
      bouteillesVidesRetour === undefined ||
      bouteillesPleinesRetour === undefined
    ) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }


    // Récupérer la livraison pour obtenir chauffeurId et camionId
    const livraisonDoc = await Livraison.findById(livraisonId);
    if (!livraisonDoc) {
      return res.status(404).json({ message: "Livraison introuvable." });
    }

    // Délégation au service
    const livraison = await LivraisonService.validerRetourLivraison(
      livraisonId,
      { bouteillesVidesRetour, bouteillesPleinesRetour, controleurId }
    );

    // Enregistrer le mouvement retour de la livraison (après validation)
    await MouvementStock.create({
      type: "entrée",
      bouteilleType: "vide",
      quantite: bouteillesVidesRetour,
      description: "Retour de livraison",
      chauffeurId: livraison.chauffeurId,
      camionId: livraison.camionId,
      controleurId,
      livraisonId: livraison._id,
    });
    console.log(`[INFO] Mouvement de stock (entrée) enregistré pour livraison ${livraison._id}`);


    // Appliquer la pénalité si besoin
    await LivraisonService.appliquerPenalite(livraison._id);

    res.json(livraison);
  } catch (error) {
    console.error("[ERREUR] validateLivraison:", error.message);
    res.status(400).json({ error: error.message });
  }
  }

  // Autres méthodes inchangées
  static async getAllLivraison(req, res) {
    try {
      const livraisons = await Livraison.find().populate('chauffeurId camionId controleurId');
      res.json(livraisons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLivraisonById(req, res) {
    try {
      const livraison = await Livraison.findById(req.params.id).populate('chauffeurId camionId controleurId');
      if (!livraison) return res.status(404).json({ message: 'Livraison introuvable' });
      res.json(livraison);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateLivraison(req, res) {
    try {
      const livraison = await Livraison.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!livraison) return res.status(404).json({ message: 'Livraison introuvable' });
      res.json(livraison);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteLivraison(req, res) {
    try {
      const livraison = await Livraison.findByIdAndDelete(req.params.id);
      if (!livraison) return res.status(404).json({ message: 'Livraison introuvable' });
      res.json({ message: 'Livraison supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLivraisonsParControleur(req, res) {
    try {
      const { controleurId } = req.params;
      const livraisons = await Livraison.find({ controleurId })
        .populate('chauffeurId', 'nom')
        .populate('camionId', 'plaqueImmatriculation')
        .populate('controleurId', 'nom')
        .sort({ date: -1 });

      res.status(200).json(livraisons);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
    }
  }



}

module.exports = LivraisonController;
