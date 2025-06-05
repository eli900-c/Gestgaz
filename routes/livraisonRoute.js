const express = require('express');
const router = express.Router();
const livraisonController = require('../controllers/livraisonController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['controleur', 'admin']), livraisonController.createLivraison);
router.get('/', authMiddleware, livraisonController.getAllLivraison);
router.get('/controleur/:controleurId', livraisonController.getLivraisonsParControleur);
router.get('/:id', authMiddleware, livraisonController.getLivraisonById);
router.patch('/validate', authMiddleware, roleMiddleware(['controleur', 'admin']), livraisonController.validateLivraison);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), livraisonController.deleteLivraison);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), livraisonController.updateLivraison);



module.exports = router;

