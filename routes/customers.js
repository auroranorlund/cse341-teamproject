const express = require('express');
const router = new express.Router();
const customersController = require('../controllers/customers');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', customersController.getAll);
router.get('/:id', validateObjectId, customersController.getSingle);
router.post('/', customersController.create);
router.put('/:id', validateObjectId, customersController.update);
router.delete('/:id', validateObjectId, customersController.delete);

module.exports = router;
