const reportController = require('../../controllers/report');
const express = require('express');
const { isOwner } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router.get('/chart', verifyToken, isOwner, reportController.getChart);
router.get('/revenue', verifyToken, isOwner, reportController.getRevenue);
router.get('/profit', verifyToken, isOwner, reportController.profit);

module.exports = router;
