const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["applied", "shortlisted", "interview", "offer", "rejected", "hired"],
    default: "applied"
  }

}, { timestamps: true });

const applicationmodel = mongoose.model("Application", applicationSchema);

module.exports = applicationmodel;
