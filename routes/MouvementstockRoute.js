const express = require('express');
const router = express.Router();
const MouvementStockController = require('../controllers/MouvementStockController');

router.get('/rapport', MouvementStockController.getRapportMouvements);

module.exports = router;
