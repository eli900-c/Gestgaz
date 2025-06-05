const Camion = require('../models/Camion');

module.exports = {
  // Créer un camion
  async create(req, res) {
    try {
      const camion = await Camion.create(req.body);
      res.status(201).json(camion);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Lister tous les camions
  async getAll(req, res) {
    try {
      const camions = await Camion.find().populate('chauffeurAttribue');
      res.json(camions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Obtenir un camion par ID
  async getById(req, res) {
    try {
      const camion = await Camion.findById(req.params.id).populate('chauffeurAttribue');
      if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
      res.json(camion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mettre à jour un camion
  async update(req, res) {
    try {
      const camion = await Camion.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
      res.json(camion);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Supprimer un camion
  async delete(req, res) {
    try {
      const camion = await Camion.findByIdAndDelete(req.params.id);
      if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
      res.json({ message: 'Camion supprimé' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
