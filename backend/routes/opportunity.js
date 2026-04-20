const router = require("express").Router();
const Opportunity = require("../models/Opportunity");

const User = require("../models/User");

// Create Opportunity (Alumni)
router.post("/create", async (req, res) => {
  try {
    const { postedBy, title, description, link, domain, type } = req.body;
    
    // Validate required fields
    if (!postedBy || !title || !description || !domain) {
      return res.status(400).send("Please fill all required opportunity fields.");
    }

    const user = await User.findById(postedBy);
    if (!user || user.role !== "alumni") {
      return res.status(403).send("Only alumni can post opportunities.");
    }

    // Pass the user's company alongside the opportunity automatically if not provided
    const opportunityData = {
      ...req.body,
      company: req.body.company || user.company || "Unknown Company"
    };

    const opportunity = new Opportunity(opportunityData);
    await opportunity.save();
    res.send(opportunity);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all Opportunities (with optional domain filtering)
router.get("/", async (req, res) => {
  try {
    const { domain } = req.query;
    let query = {};
    if (domain) query.domain = domain;
    
    // Sort by newest
    const opportunities = await Opportunity.find(query)
      .populate("postedBy", "name email company profession")
      .sort({ createdAt: -1 });

    res.send(opportunities);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
