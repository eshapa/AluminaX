const router = require("express").Router();
const Session = require("../models/Session");

// Schedule a new session
router.post("/schedule", async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.send(session);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get upcoming sessions for a user (student or alumni)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({
      $or: [{ studentId: userId }, { alumniId: userId }],
      status: "scheduled"
    }).populate("studentId alumniId", "name email role");

    res.send(sessions);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
