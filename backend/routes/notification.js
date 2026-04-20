const router = require("express").Router();
const Notification = require("../models/Notification");

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.send(notifications);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Mark all as read
router.post("/mark-read/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.send({ success: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
