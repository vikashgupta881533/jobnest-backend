const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  location: {
    type: String
  },

  type: {
    type: String,          // Full-time / Part-time / Hybrid / Remote
    default: "Full-time"
  },

  salaryMin: {
    type: Number
  },

  salaryMax: {
    type: Number
  },

  description: {
    type: String
  },

  skillsRequired: {
    type: String            // comma separated, keep it simple like User.skills
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "live", "rejected"],
    default: "pending"       // admin reviews before it goes live
  }

}, { timestamps: true });

const jobmodel = mongoose.model("Job", jobSchema);

module.exports = jobmodel;
