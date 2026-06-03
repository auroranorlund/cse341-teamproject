const express = require('express');
const router = new express.Router();
const ordersController = require('../controllers/orders');

router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getSingle);
router.post('/', ordersController.create);
router.put('/:id', ordersController.update);
router.delete('/:id', ordersController.delete);

module.exports = router;
