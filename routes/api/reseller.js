const express = require('express');
const resellerController = require('../../controllers/reseller');
const { isOwner, isAdmin } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, resellerController.getAll);
router.get('/:reseller_id', verifyToken, resellerController.getSpecific);
router.post('/', verifyToken, isAdmin, resellerController.insert);
router.put('/update/:reseller_id', verifyToken, isOwner, resellerController.update);
router.delete('/delete/:reseller_id', verifyToken, isOwner, resellerController.delete);

module.exports = router;