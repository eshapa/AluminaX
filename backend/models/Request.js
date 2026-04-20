const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentId: String,
  alumniId: String,
  topic: String, // Resume review, Career guidance, Internship help
  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Request", requestSchema);