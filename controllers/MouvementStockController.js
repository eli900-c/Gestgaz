const MouvementStock = require("../models/StockMovement");

class MouvementStockController {
  static async getRapportMouvements(req, res) {
    try {
      const { dateDebut, dateFin, type, bouteilleType } = req.query;

      const filtre = {};

      if (dateDebut || dateFin) {
        filtre.date = {};
        if (dateDebut) filtre.date.$gte = new Date(dateDebut);
        if (dateFin) filtre.date.$lte = new Date(dateFin);
      }

      if (type) filtre.type = type;
      if (bouteilleType) filtre.bouteilleType = bouteilleType;

      const mouvements = await MouvementStock.find(filtre)
        .populate('chauffeurId', 'nom')
        .populate('camionId', 'plaqueImmatriculation')
        .populate('controleurId', 'nom')
        .populate('livraisonId', '_id')
        .sort({ date: -1 });

      res.status(200).json(mouvements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MouvementStockController;
