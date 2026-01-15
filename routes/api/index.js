const express = require('express');
const router = express.Router();

router.use("/auth", require('./auth'));
router.use('/users', require('./users'));
router.use('/products', require('./product'));
router.use('/stores', require('./store'));
router.use('/services', require('./service'));
router.use('/members', require('./member'));
router.use('/orders', require('./order'));
router.use('/mechanics', require('./mechanic'));
router.use('/resellers', require('./reseller'));
router.use('/service-types', require('./serviceType'));
router.use('/return', require('./return'));

// SUPER ADMIN ONLY
router.use('/reports', require('./report'));

module.exports = router;
