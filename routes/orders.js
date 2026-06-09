const express = require('express');
const router = new express.Router();
const ordersController = require('../controllers/orders');
const validateObjectId = require('../middleware/validateObjectId');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', ordersController.getAll);
router.get('/:id', validateObjectId, ordersController.getSingle);
router.post('/', isAuthenticated, ordersController.create);
router.put('/:id', isAuthenticated, validateObjectId, ordersController.update);
router.delete('/:id', isAuthenticated, validateObjectId, ordersController.delete);

module.exports = router;
