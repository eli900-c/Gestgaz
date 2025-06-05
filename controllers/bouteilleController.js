const Bouteille = require('../models/Bouteille');

class bouteilleController {
  // Créer une nouvelle bouteille
  static async createBouteille(req, res) {
    try {
      const { typeGaz, capaciteKg, prixConsigne, prixVente, codeBarre } = req.body;
      const bouteille = new Bouteille({ typeGaz, capaciteKg, prixConsigne, prixVente, codeBarre });
      await bouteille.save();
      res.status(201).json(bouteille);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtenir toutes les bouteilles
  static async getAllBouteille(req, res) {
    try {
      const bouteille = await Bouteille.find();
      res.json(bouteille);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtenir une bouteille par ID
  static async getBouteilleById(req, res) {
    try {
      const bouteille = await Bouteille.findById(req.params.id);
      if (!bouteille) return res.status(404).json({ message: 'Bouteille non trouvée' });
      res.json(bouteille);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour une bouteille
  static async updateBouteille(req, res) {
    try {
      const bouteille = await Bouteille.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!bouteille) return res.status(404).json({ message: 'Bouteille non trouvée' });
      res.json(bouteille);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Supprimer une bouteille
  static async deleteBouteille(req, res) {
    try {
      const bottle = await Bouteille.findByIdAndDelete(req.params.id);
      if (!bottle) return res.status(404).json({ message: 'Bouteille non trouvée' });
      res.json({ message: 'Bouteille supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = bouteilleController;
