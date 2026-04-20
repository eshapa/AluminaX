const router = require("express").Router();
const User = require("../models/User");
const Request = require("../models/Request");
const Opportunity = require("../models/Opportunity");

router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAlumni = await User.countDocuments({ role: "alumni" });
    const totalRequests = await Request.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();

    res.json({
      totalUsers: totalStudents + totalAlumni + 1, // Admin is 1
      totalStudents,
      totalAlumni,
      totalRequests,
      totalOpportunities
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
