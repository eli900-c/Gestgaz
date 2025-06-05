const express = require('express');
const router = express.Router();
const salaireController = require('../controllers/salaireController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/calculate', authMiddleware, roleMiddleware('admin'), salaireController.calculateSalaire);
router.get('/:id', authMiddleware, roleMiddleware('admin'), salaireController.getSalaireById);
router.get('/', authMiddleware, roleMiddleware('admin'), salaireController.getSalaire);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), salaireController.deleteSalaire);
module.exports = router;
