const express = require('express');
const router = new express.Router();
const employeesController = require('../controllers/employees');
const validateObjectId = require('../middleware/validateObjectId');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', employeesController.getAll);
router.get('/:id', validateObjectId, employeesController.getSingle);
router.post('/', isAuthenticated, employeesController.create);
router.put('/:id', isAuthenticated, validateObjectId, employeesController.update);
router.delete('/:id', isAuthenticated, validateObjectId, employeesController.delete);

module.exports = router;
