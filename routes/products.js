const express = require('express');
const router = new express.Router();
const productsController = require('../controllers/products');
const validateObjectId = require('../middleware/validateObjectId');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', productsController.getAll);
router.get('/:id', validateObjectId, productsController.getSingle);
router.post('/', isAuthenticated, productsController.create);
router.put('/:id', isAuthenticated, validateObjectId, productsController.update);
router.delete('/:id', isAuthenticated, validateObjectId, productsController.delete);

module.exports = router;
