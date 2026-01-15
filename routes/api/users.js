const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/user');
const { isOwner } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');

router.get('/', verifyToken, isOwner, usersController.getAll);
router.get('/:user_id', verifyToken, usersController.getSpecific);
router.post('/', verifyToken, isOwner, usersController.add);
router.put('/update/:user_id', verifyToken, usersController.update);
router.delete('/delete/:user_id', verifyToken, isOwner, usersController.delete);

module.exports = router;
