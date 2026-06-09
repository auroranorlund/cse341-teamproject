const express = require('express');
const router = new express.Router();
const customersController = require('../controllers/customers');
const validateObjectId = require('../middleware/validateObjectId');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', customersController.getAll);
router.get('/:id', validateObjectId, customersController.getSingle);
router.post('/', isAuthenticated, customersController.create);
router.put('/:id', isAuthenticated, validateObjectId, customersController.update);
router.delete('/:id', isAuthenticated, validateObjectId, customersController.delete);

module.exports = router;
