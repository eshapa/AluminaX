const router = require("express").Router();
const User = require("../models/User");

router.get("/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).send("Student not found");

    const { skillFilter, domainFilter } = req.query;

    let alumniQuery = {
      role: "alumni",
      profileCompleted: true
    };
    
    if (domainFilter) {
      alumniQuery.domain = new RegExp(domainFilter, "i");
    }

    const alumni = await User.find(alumniQuery);

    const matches = alumni.filter(a => {
      if (skillFilter) {
        return a.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
      }
      return true;
    }).map(a => {
      let score = 0;
      
      // Calculate Skill matches (50% weight)
      // Intersection count: what % of the student's skills does the alumni have?
      let matchedSkills = 0;
      const totalStudentSkills = student.skills?.length || 1;
      
      if (student.skills && student.skills.length > 0) {
        student.skills.forEach(skill => {
          if (a.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()))) {
            matchedSkills++;
          }
        });
      }
      const skillScore = student.skills?.length ? (matchedSkills / totalStudentSkills) * 50 : 0;

      // Calculate Domain match (30% weight)
      let domainScore = 0;
      const aDomain = a.domain || a.profession || a.company || "";
      if (student.domain && aDomain) {
        if (student.domain.toLowerCase() === aDomain.toLowerCase()) {
          domainScore = 30; // Exact
        } else if (student.domain.toLowerCase().includes(aDomain.toLowerCase()) || aDomain.toLowerCase().includes(student.domain.toLowerCase())) {
          domainScore = 15; // Partial match
        }
      }

      // Calculate Experience relevance (20% weight)
      let experienceScore = 0;
      const studentGoal = (student.careerGoal || "").toLowerCase();
      const aProf = (a.profession || "").toLowerCase();
      const aExp = parseInt(a.experience) || 0;
      
      if (studentGoal && aProf) {
         if (studentGoal.includes(aProf) || aProf.includes(studentGoal)) {
            // Highly relevant profession
            experienceScore += 10;
            // More experience gives more relevance points, up to max 10
            experienceScore += Math.min(aExp * 2, 10);
         } else if (aExp > 0) {
            // Some professional experience still has baseline value even if not perfect match
            experienceScore += Math.min(aExp, 5);
         }
      } else if (aExp > 0) {
          experienceScore += Math.min(aExp, 5);
      }

      score = Math.min(Math.round(skillScore + domainScore + experienceScore), 100);

      // Enhance score for very new profiles
      if (score === 0 && domainScore > 0) score = domainScore;
      if (score === 0 && experienceScore > 0) score = experienceScore;
      
      const matchPercentage = isNaN(score) ? 10 : score;

      return { ...a._doc, matchPercentage };
    });

    // Sort by Match Percentage High -> Low
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.send(matches);
  } catch (err) {
    res.status(500).send("Error calculating matches");
  }
});

module.exports = router;