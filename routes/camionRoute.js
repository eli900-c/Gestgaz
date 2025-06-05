const express = require('express');
const router = express.Router();
const camionController = require('../controllers/camionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.post('/', authMiddleware, roleMiddleware(['admin']), camionController.create);
router.get('/', authMiddleware, camionController.getAll);
router.get('/:id', authMiddleware, camionController.getById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), camionController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), camionController.delete);

module.exports = router;
