const express = require('express');
const router = new express.Router();
const ordersController = require('../controllers/orders');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', ordersController.getAll);
router.get('/:id', validateObjectId, ordersController.getSingle);
router.post('/', ordersController.create);
router.put('/:id', validateObjectId, ordersController.update);
router.delete('/:id', validateObjectId, ordersController.delete);

module.exports = router;
