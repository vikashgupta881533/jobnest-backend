const {sendMessage,getMessages} = require('../controller/messagecontroller')

const express = require('express');
const authmiddle = require('../middleware/middleware');
const router = express.Router();

router.post('/messages', authmiddle, sendMessage)
router.get('/messages/:applicationId', authmiddle, getMessages)

module.exports = router
