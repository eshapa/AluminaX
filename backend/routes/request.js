const router = require("express").Router();
const mongoose = require("mongoose");
const Request = require("../models/Request");
const Notification = require("../models/Notification");
const Conversation = require("../models/Conversation");

// send request
// ... (omitted for brevity in instruction but keep original)
router.post("/send", async (req, res) => {
  try {
    const { studentId, alumniId, topic } = req.body;

    const existing = await Request.findOne({
      studentId,
      alumniId,
      status: { $in: ["Pending", "Accepted"] }
    });

    if (existing) {
      return res.status(400).send("A pending or active request already exists for this alumni.");
    }

    const request = new Request(req.body);
    await request.save();

    // Create notification for alumni
    await Notification.create({
      userId: alumniId,
      type: "NEW_REQUEST",
      message: "You have received a new mentorship request."
    });

    res.send(request);
  } catch (err) {
    res.status(500).send("Error sending request.");
  }
});

// get alumni requests
router.get("/:alumniId", async (req, res) => {
  const requests = await Request.find({ alumniId: req.params.alumniId })
    .populate("studentId", "name email profileCompleted skills interests");
  res.send(requests);
});

// get student requests
router.get("/student/:studentId", async (req, res) => {
  const requests = await Request.find({ studentId: req.params.studentId })
    .populate("alumniId", "name company profession");
  res.send(requests);
});

// accept/reject
router.post("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // If accepted, create a conversation
    if (status === "Accepted") {
      const studentId = new mongoose.Types.ObjectId(request.studentId);
      const alumniId = new mongoose.Types.ObjectId(request.alumniId);

      const existingConvo = await Conversation.findOne({
        participants: { $all: [studentId, alumniId] }
      });

      if (!existingConvo) {
        await Conversation.create({
          participants: [studentId, alumniId]
        });
      }
    }

    // Notify student
    await Notification.create({
      userId: request.studentId,
      type: `REQUEST_${status.toUpperCase()}`,
      message: `Your mentorship request has been ${status}.`
    });

    res.send(request);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating request.");
  }
});

module.exports = router;