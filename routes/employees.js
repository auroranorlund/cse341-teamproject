const express = require('express');
const router = new express.Router();
const employeesController = require('../controllers/employees');

router.get('/', employeesController.getAll);
router.get('/:id', employeesController.getSingle);
router.post('/', employeesController.create);
router.put('/:id', employeesController.update);
router.delete('/:id', employeesController.delete);

module.exports = router;
