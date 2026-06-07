const express = require('express');
const router = new express.Router();
const employeesController = require('../controllers/employees');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', employeesController.getAll);
router.get('/:id', validateObjectId, employeesController.getSingle);
router.post('/', employeesController.create);
router.put('/:id', validateObjectId, employeesController.update);
router.delete('/:id', validateObjectId, employeesController.delete);

module.exports = router;
