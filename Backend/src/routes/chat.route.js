const express = require('express');
const authMiddileware = require('../middlewares/auth.middleware');
const chatController  = require('../controllers/chat.controller');
const router = express.Router();

router.post('/', authMiddileware.authUser, chatController.createChat);

module.exports = router;