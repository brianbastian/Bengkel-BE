const express = require('express');
const { isAdmin } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');
const returnController = require('../../controllers/return');
const router = express.Router();

router.get('/', verifyToken, isAdmin, returnController.getAll);
router.get('/:return_id', verifyToken, isAdmin, returnController.getSpecific);
router.post('/', verifyToken, isAdmin, returnController.insert);
router.delete('/delete/:return_id', verifyToken, isAdmin, returnController.delete);

module.exports = router;