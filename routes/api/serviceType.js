const express = require('express');
const serviceTypeController = require('../../controllers/serviceType');
const router = express.Router();
const { verifyToken } = require('../../middlewares/auth');
const { isOwner } = require('../../middlewares/role');

router.get('/', verifyToken, serviceTypeController.getAll);
router.get('/:type_id', verifyToken, serviceTypeController.getSpecific);
router.put('/update/:type_id', verifyToken, isOwner, serviceTypeController.update);
router.post('/', verifyToken, isOwner, serviceTypeController.insert);
router.delete('/delete/:type_id', verifyToken, isOwner, serviceTypeController.delete);

module.exports = router;