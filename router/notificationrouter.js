const {getMyNotifications,markAsRead,markAllAsRead} = require('../controller/notificationcontroller')

const express = require('express');
const authmiddle = require('../middleware/middleware');
const router = express.Router();

router.get('/notifications', authmiddle, getMyNotifications)
router.patch('/notifications/:id/read', authmiddle, markAsRead)
router.patch('/notifications/read-all', authmiddle, markAllAsRead)

module.exports = router
