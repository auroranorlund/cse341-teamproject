const express = require('express');
const router = new express.Router();
const ordersController = require('../controllers/orders');
const validateObjectId = require('../middleware/validateObjectId');
const { isAuthenticated } = require('../middleware/authenticate');
const {validateData, orderRules} = require('../middleware/validationStation');

router.get('/', ordersController.getAll);
router.get('/:id', validateObjectId, ordersController.getSingle);
router.post('/', isAuthenticated, validateData(orderRules), ordersController.create);
router.put('/:id', isAuthenticated, validateObjectId, validateData(orderRules), ordersController.update);
router.delete('/:id', isAuthenticated, validateObjectId,  ordersController.delete);

module.exports = router;
