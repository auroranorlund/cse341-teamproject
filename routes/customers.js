const express = require('express');
const router = new express.Router();
const customersController = require('../controllers/customers');
const validateObjectId = require('../middleware/validateObjectId');
const { isAuthenticated } = require('../middleware/authenticate');
const {validateData, customerRules} = require('../middleware/validationStation');

router.get('/', customersController.getAll);
router.get('/:id', validateObjectId, customersController.getSingle);
router.post('/', isAuthenticated, validateData(customerRules), customersController.create);
router.put('/:id', isAuthenticated, validateObjectId, validateData(customerRules), customersController.update);
router.delete('/:id', isAuthenticated, validateObjectId, customersController.delete);

module.exports = router;
