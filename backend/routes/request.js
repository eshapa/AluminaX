const router = require("express").Router();
const Request = require("../models/Request");

const Notification = require("../models/Notification");

// send request
router.post("/send", async (req, res) => {
  try {
    const { studentId, alumniId } = req.body;

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
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  // Notify student
  await Notification.create({
    userId: request.studentId,
    type: `REQUEST_${req.body.status.toUpperCase()}`,
    message: `Your mentorship request has been ${req.body.status}.`
  });

  res.send(request);
});

module.exports = router;