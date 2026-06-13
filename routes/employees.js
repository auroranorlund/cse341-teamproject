const express = require('express');
const router = new express.Router();
const employeesController = require('../controllers/employees');
const validateObjectId = require('../middleware/validateObjectId');
const { isAuthenticated } = require('../middleware/authenticate');
const {validateData, employeeRules} = require('../middleware/validationStation');

router.get('/', employeesController.getAll);
router.get('/:id', validateObjectId, employeesController.getSingle);
router.post('/', isAuthenticated, validateData(employeeRules), employeesController.create);
router.put('/:id', isAuthenticated, validateObjectId, validateData(employeeRules), employeesController.update);
router.delete('/:id', isAuthenticated, validateObjectId,  employeesController.delete);

module.exports = router;
