const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  link: {
    type: String   // frontend route to send them to when clicked, optional
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const notificationmodel = mongoose.model("Notification", notificationSchema);

module.exports = notificationmodel;
