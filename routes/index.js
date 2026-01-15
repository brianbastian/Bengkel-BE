const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const testController = require('../controllers/test');

/* GET home page. */
router.get('/', require('../controllers/indexController').get);

router.use('/api', require('./api'));
// router.use('/admin', require('./admin'));

module.exports = router;
