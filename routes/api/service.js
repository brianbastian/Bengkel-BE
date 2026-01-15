const express = require('express');
const { isOwner } = require('../../middlewares/role');
const { verifyToken } = require('../../middlewares/auth');
const serviceController = require('../../controllers/service');
const router = express.Router();

router.get('/', verifyToken, serviceController.getAll);
router.get('/:service_id', verifyToken, serviceController.getSpecific);
router.get('/active', verifyToken, serviceController.getNotDone);
router.get('/done', verifyToken, serviceController.getDone);
router.post('/', verifyToken, serviceController.insert);
router.put('/update/:service_id', verifyToken, serviceController.update);
router.put('/to-process/:service_id', verifyToken, serviceController.process);
router.put('/to-done/:service_id', verifyToken, serviceController.done);

module.exports = router;