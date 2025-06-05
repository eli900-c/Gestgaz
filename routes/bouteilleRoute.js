const express = require('express');
const router = express.Router();
const bouteilleController = require('../controllers/bouteilleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('admin'), bouteilleController.createBouteille);
router.get('/', authMiddleware, bouteilleController.getAllBouteille);
router.put('/:id', authMiddleware, roleMiddleware('controleur'), bouteilleController.updateBouteille);


module.exports = router;


