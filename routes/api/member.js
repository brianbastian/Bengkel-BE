const express = require('express');
const MemberController = require('../../controllers/member');
const { isOwner, isAdmin } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, MemberController.getAll);
router.get('/:member_id', verifyToken, MemberController.getSpecific);
router.put('/update/:member_id', verifyToken, isOwner, MemberController.update);
router.post('/', verifyToken, isAdmin, MemberController.insert);
router.delete('/delete/:member_id', verifyToken, isOwner, MemberController.delete);

module.exports = router;