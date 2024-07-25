const express = require('express');
const UserController = require('../controllers/user');
const router = express.Router();

router.get('/user/:id/records', UserController.get_user_records);
router.post('/user/:id/records', UserController.post_user_record);
router.put('/user/:id/:date/records', UserController.post_user_record);



module.exports = router;