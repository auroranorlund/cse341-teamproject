const express = require('express');
const router = new express.Router();
const productsController = require('../controllers/products');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', productsController.getAll);
router.get('/:id', validateObjectId, productsController.getSingle);
router.post('/', productsController.create);
router.put('/:id', validateObjectId, productsController.update);
router.delete('/:id', validateObjectId, productsController.delete);

module.exports = router;
