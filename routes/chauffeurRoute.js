const express = require('express');
const router = express.Router();
const ChauffeurController = require('../controllers/chauffeurController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Toutes les routes nécessitent que l'utilisateur soit connecté et admin
router.post('/',authMiddleware, roleMiddleware(['controleur', 'admin']), ChauffeurController.ajouterChauffeur);
router.get('/', authMiddleware, roleMiddleware(['admin']), ChauffeurController.listerChauffeurs);
router.get('/:id', authMiddleware, roleMiddleware(['controleur', 'admin']), ChauffeurController.voirChauffeur);
router.put('/:id', authMiddleware, roleMiddleware('admin'), ChauffeurController.modifierChauffeur);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ChauffeurController.supprimerChauffeur);
router.get('/:id/livraisons', ChauffeurController.voirLivraisonsDuChauffeur);
router.post('/:id/performance', authMiddleware, roleMiddleware(['admin']), ChauffeurController.performanceChauffeur);
module.exports = router;
