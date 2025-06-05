const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware');   // <-- importer authMiddleware
const roleMiddleware = require('../middlewares/roleMiddleware');   // <-- importer roleMiddleware


router.post('/', authMiddleware, roleMiddleware('admin'), stockController.createStock);
router.patch('/', authMiddleware, roleMiddleware(['controleur', 'admin']), stockController.updateStock);
router.put('/:id', authMiddleware, roleMiddleware('admin'), stockController.updateStock);
router.get('/:id', authMiddleware, stockController.getStock);
router.get('/', authMiddleware,roleMiddleware(['controleur', 'admin']), stockController.getAllStocks);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), stockController.deleteStock);



module.exports = router;