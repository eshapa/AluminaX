const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,

  // Shared
  skills: [String],
  domain: String, // Domain of interest/expertise
  
  // Student Specific
  branch: String,
  year: String,
  cgpa: String,
  careerGoal: String,
  interests: [String],

  // Alumni Specific
  company: String,
  experience: String,
  profession: String,
  careerJourney: String,
  
  profileCompleted: {
    type: Boolean,
    default: false
  },

  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

module.exports = mongoose.model("User", userSchema);