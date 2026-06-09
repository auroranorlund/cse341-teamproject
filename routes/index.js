const express = require('express');
const passport = require('passport');
const router = new express.Router();

router.use('/api-docs', require('./swaggerRoutes'));
router.use('/products', require('./products'));
router.use('/customers', require('./customers'));
router.use('/orders', require('./orders'));
router.use('/employees', require('./employees'));

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  })
})


module.exports = router;
