const express = require('express');
const router = new express.Router();

//router.use('/', require('./swaggerRoutes'));
router.use('/products', require('./products'));
router.use('/customers', require('./customers'));
router.use('/orders', require('./orders'));
router.use('/employees', require('./employees'));


module.exports = router;
