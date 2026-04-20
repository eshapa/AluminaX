const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  domain: String,
  type: String, // e.g., "Full-time", "Internship"
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // The Alumni who posted it
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Opportunity", opportunitySchema);
