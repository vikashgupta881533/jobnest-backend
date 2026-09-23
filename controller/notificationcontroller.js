const notificationmodel = require('../model/NotificationSchema')

// tiny helper other controllers import to create a notification —
// keeps the "create a notification" logic in one place
const createNotification = async(userId, text, link)=>{
    await notificationmodel.create({user:userId, text, link})
}

// GET /notifications  (own notifications, newest first)
const getMyNotifications = async(req,res)=>{
    const data = await notificationmodel.find({user:req.user.userid})
        .sort({createdAt:-1})
        .limit(30)

    res.json(data)
}

// PATCH /notifications/:id/read
const markAsRead = async(req,res)=>{
    const data = await notificationmodel.findByIdAndUpdate(
        req.params.id,
        {read:true},
        {new:true}
    )
    res.json(data)
}

// PATCH /notifications/read-all
const markAllAsRead = async(req,res)=>{
    await notificationmodel.updateMany({user:req.user.userid, read:false}, {read:true})
    res.json("all marked as read")
}

module.exports = {createNotification,getMyNotifications,markAsRead,markAllAsRead}
