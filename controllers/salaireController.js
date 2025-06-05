const Salaire = require('../models/Salaire');
const SalaireService = require('../services/SalaireService');

class SalaireController {
  // Calculer un salaire via le service
  static async calculateSalaire(req, res) {
    try {
      const { chauffeurId, moisAnnee } = req.body;
      const salaire = await SalaireService.calculerSalaire(chauffeurId, moisAnnee);
      res.json(salaire);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Récupérer tous les salaires
  // Récupérer tous les salaires ou filtrer par chauffeurId si fourni
static async getSalaire(req, res) {
  try {
    const { chauffeurId } = req.query;

    // Si un chauffeurId est fourni dans les paramètres de requête, on filtre.
    const filtre = chauffeurId ? { chauffeurId } : {};

    const salaires = await Salaire.find(filtre).populate('chauffeurId', 'nom');
    res.json(salaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


  // Récupérer un salaire par ID
  static async getSalaireById(req, res) {
    try {
      const salaire = await Salaire.findById(req.params.id).populate('chauffeurId');
      if (!salaire) return res.status(404).json({ message: 'Salaire non trouvé' });
      res.json(salaire);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Modifier un salaire manuellement
  static async updateSalaire(req, res) {
    try {
      const salaire = await Salaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!salaire) return res.status(404).json({ message: 'Salaire non trouvé' });
      res.json(salaire);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Supprimer un salaire
  static async deleteSalaire(req, res) {
    try {
      const salaire = await Salaire.findByIdAndDelete(req.params.id);
      if (!salaire) return res.status(404).json({ message: 'Salaire non trouvé' });
      res.json({ message: 'Salaire supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SalaireController;
