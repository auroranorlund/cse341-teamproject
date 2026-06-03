const express = require('express');
const router = new express.Router();
const customersController = require('../controllers/customers');

router.get('/', customersController.getAll);
router.get('/:id', customersController.getSingle);
router.post('/', customersController.create);
router.put('/:id', customersController.update);
router.delete('/:id', customersController.delete);

module.exports = router;
