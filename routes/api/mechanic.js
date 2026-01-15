const express = require('express');
const mechanicController = require('../../controllers/mechanic');
const router = express.Router();
const { isOwner } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');

router.get('/', verifyToken, mechanicController.getAll);
router.get('/:mechanic_id', verifyToken, mechanicController.getSpecific);
router.post('/', verifyToken, isOwner, mechanicController.insert);
router.post('/bonus', mechanicController.bonus);
router.put('/update/:mechanic_id', verifyToken, isOwner, mechanicController.update);
router.delete('/delete/:mechanic_id', verifyToken, isOwner, mechanicController.delete);

module.exports = router;