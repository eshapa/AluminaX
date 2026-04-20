const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request"
  },
  date: Date,
  time: String,
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled"
  },
  meetingLink: String
});

module.exports = mongoose.model("Session", sessionSchema);
