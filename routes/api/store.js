const express = require('express');
const { verifyToken } = require('../../middlewares/auth');
const { isOwner } = require('../../middlewares/role');
const storeController = require('../../controllers/store');
const router = express.Router();

router.get('/', verifyToken, isOwner, storeController.getAll);
router.get('/:store_id', verifyToken, isOwner, storeController.getSpecific);
router.post('/insert', verifyToken, isOwner, storeController.insert);
router.put('/update/:store_id', verifyToken, isOwner, storeController.update);
router.delete('/delete/:store_id', verifyToken, isOwner, storeController.delete);

module.exports = router;