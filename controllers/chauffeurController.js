const Chauffeur = require('../models/Chauffeur');
const Livraison = require('../models/Livraison');


class ChauffeurController {
  // ➕ Ajouter un chauffeur
  static async ajouterChauffeur(req, res) {
    try {
      const { nom, telephone, date_embauche, actif } = req.body;
      const nouveauChauffeur = new Chauffeur({ nom, telephone, date_embauche, actif });
      await nouveauChauffeur.save();
      res.status(201).json(nouveauChauffeur);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l’ajout', error: error.message });
    }
  }

  // 📋 Lister tous les chauffeurs
  static async listerChauffeurs(req, res) {
    try {
      const chauffeurs = await Chauffeur.find().sort({ nom: 1 });
      res.status(200).json(chauffeurs);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors du chargement', error: error.message });
    }
  }

  // 🔍 Voir un seul chauffeur
  static async voirChauffeur(req, res) {
    try {
      const chauffeur = await Chauffeur.findById(req.params.id);
      if (!chauffeur) return res.status(404).json({ message: 'Chauffeur non trouvé' });
      res.status(200).json(chauffeur);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
    }
  }

  // ✏️ Modifier un chauffeur
  static async modifierChauffeur(req, res) {
    try {
      const chauffeur = await Chauffeur.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
      });
      if (!chauffeur) return res.status(404).json({ message: 'Chauffeur non trouvé' });
      res.status(200).json(chauffeur);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la modification', error: error.message });
    }
  }

  // ❌ Supprimer un chauffeur
  static async supprimerChauffeur(req, res) {
    try {
      const chauffeur = await Chauffeur.findByIdAndDelete(req.params.id);
      if (!chauffeur) return res.status(404).json({ message: 'Chauffeur non trouvé' });
      res.status(200).json({ message: 'Chauffeur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  static async voirLivraisonsDuChauffeur(req, res) {
    try {
      const { id } = req.params;
      const livraisons = await Livraison.find({ chauffeurId: id }).sort({ dateDepart: -1 });
      res.status(200).json(livraisons);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des livraisons', error: error.message });
    }
  }

  static async performanceChauffeur(req, res) {
    try {
      const { id } = req.params;
      let { debut, fin } = req.body;

      let dateDebut = debut ? new Date(debut) : new Date('2025-01-01');
      let dateFin = fin ? new Date(fin) : new Date();

      if (isNaN(dateDebut) || isNaN(dateFin)) {
        return res.status(400).json({ message: "Les dates fournies sont invalides. Format attendu : YYYY-MM-DD" });
      }

      // Récupérer le chauffeur
      const chauffeur = await Chauffeur.findById(id);
      if (!chauffeur) {
        return res.status(404).json({ message: "Chauffeur non trouvé" });
      }

      // Récupérer les livraisons du chauffeur sur la période
      const livraisons = await Livraison.find({
        chauffeurId: id,
        dateDepart: { $gte: dateDebut, $lte: dateFin },
        status: 'validee'
      });

      // Calculs
      const bouteillesVendues = livraisons.reduce((sum, l) => sum + (l.bouteillesPleinesDepart - l.bouteillesPleinesRetour), 0);
      const bouteillesManquantes = livraisons.reduce((sum, l) => sum + (l.bouteillesPleinesDepart - l.bouteillesVidesRetour - l.bouteillesPleinesRetour), 0);
      const penalites = livraisons.reduce((sum, l) => sum + (l.penalite || 0), 0);

      res.json({
        chauffeurId: id,
        nom: chauffeur.nom,
        telephone: chauffeur.telephone,
        periode: { debut: dateDebut.toISOString().slice(0,10), fin: dateFin.toISOString().slice(0,10) },
        livraisons: livraisons.length,
        bouteillesVendues,
        bouteillesManquantes,
        penalites
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}



module.exports = ChauffeurController;
