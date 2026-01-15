const express = require('express');
const OrderController = require('../../controllers/order');
const { isOwner, isAdmin } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, OrderController.getAll);
router.get('/:order_id', verifyToken, OrderController.getSpecific);
router.post('/', verifyToken, OrderController.insert);
router.put('/update/:order_id', verifyToken, OrderController.update);
router.delete('/delete/:order_id', verifyToken, isOwner, OrderController.delete);
router.post('/payment/:order_id', verifyToken, isAdmin, OrderController.payment);

module.exports = router;