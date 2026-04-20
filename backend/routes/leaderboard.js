const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const Session = require("../models/Session");
const Request = require("../models/Request");

router.get("/", async (req, res) => {
  try {
    const alumniList = await User.find({ role: "alumni" })
      .select("name company profession skills profileCompleted");

    const leaderboard = await Promise.all(
      alumniList.map(async (alumni) => {
        const jobsCount = await Opportunity.countDocuments({ postedBy: alumni._id });
        const sessionsCount = await Session.countDocuments({ 
            alumniId: alumni._id, 
            status: { $in: ["completed", "scheduled"] } 
        });
        const requestsCount = await Request.countDocuments({ alumniId: alumni._id });

        const score = (jobsCount * 10) + (sessionsCount * 5) + (requestsCount * 2);

        return {
          _id: alumni._id,
          name: alumni.name,
          company: alumni.company,
          profession: alumni.profession,
          skills: alumni.skills,
          profileCompleted: alumni.profileCompleted,
          stats: {
            jobsPosted: jobsCount,
            sessions: sessionsCount,
            messages: requestsCount
          },
          score: score
        };
      })
    );

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ error: "Server error generating leaderboard" });
  }
});

module.exports = router;
