const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  text: {
    type: String,
    required: true
  }

}, { timestamps: true });

const messagemodel = mongoose.model("Message", messageSchema);

module.exports = messagemodel;
