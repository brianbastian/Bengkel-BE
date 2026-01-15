const express = require('express');
const productController = require('../../controllers/product');
const router = express.Router();
const { isOwner } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');

router.get('/', verifyToken, productController.getAll);
router.get('/detail/:product_id', verifyToken, productController.getSpecific);
router.get('/active', verifyToken, productController.getActive);
router.get('/non-active', verifyToken, productController.getNonActive);
router.post('/', verifyToken, isOwner, productController.insert);
router.put('/update/:product_id', verifyToken, isOwner, productController.update);
router.delete('/delete/:product_id', verifyToken, isOwner, productController.delete);
router.post('/upload', verifyToken, isOwner, productController.upload);

module.exports = router;