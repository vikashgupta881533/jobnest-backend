const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  resetToken: {
    type: String
  },

  resetTokenExpiry: {
    type: Date
  },

  phone: {
    type: String
  },

  role: {
    type: String,
    default: "candidate",
    lowercase: true
  },

  // only meaningful for role:"recruiter" — admin approves before
  // the recruiter can post jobs
  isApproved: {
    type: Boolean,
    default: false
  },

  headline: {
    type: String
  },

  // recruiter ka company name (candidate ko dikhta hai)
  companyName: {
    type: String
  },

  bio: {
    type: String
  },

  location: {
    type: String
  },

  skills: {
    type: String
  },

  experience: {
    type: Number,
    default: 0
  },

  degree: {
    type: String
  },

  college: {
    type: String
  },

  year: {
    type: Number
  },

  resume: {
    type: String
  },

  profilePhoto: {
    type: String
  },

  // jobs the candidate has bookmarked
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }]

}, { timestamps: true });

const usermodel = mongoose.model("User",userSchema);

module.exports = usermodel