const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).send("Invalid email format.");
    }

    if (!data.password || data.password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters.");
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).send("Email is already registered. Please log in.");
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = new User({
      ...data,
      password: hashed
    });

    await user.save();

    res.status(201).json({
      token: generateToken(user._id),
      user: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during registration.");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("Invalid credentials.");

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).send("Invalid credentials.");

    res.json({
      token: generateToken(user._id),
      user: user
    });
  } catch(err) {
    console.error(err);
    res.status(500).send("Server error during login.");
  }
});

// UPDATE PROFILE (STUDENT + ALUMNI)
router.post("/update-profile/:id", async (req, res) => {
  try {
    const data = req.body;
    
    // Server-side validation
    if (data.role === "student") {
      if (!data.cgpa || !data.skills || data.skills.length === 0 || !data.domain) {
         return res.status(400).send("Please fill all required student fields.");
      }
      const cgpa = parseFloat(data.cgpa);
      if (cgpa < 0 || cgpa > 10) return res.status(400).send("CGPA must be between 0 and 10.");
    } else if (data.role === "alumni") {
      if (!data.company || !data.experience || !data.skills || data.skills.length === 0) {
         return res.status(400).send("Please fill all required alumni fields.");
      }
      if (isNaN(parseFloat(data.experience))) {
         return res.status(400).send("Experience must be a numeric value.");
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, profileCompleted: true },
      { new: true }
    );

    res.send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET PROFILE
router.get("/profile/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpire");
        if(user) {
            res.json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch(err) {
        res.status(500).send("Server error");
    }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 Minutes

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    
    // Plain text fallback
    const message = `You are receiving this email because a password reset request was made for your AlumNetX account.\n\nPlease reset your password by making a PUT request to: \n\n ${resetUrl} \n\nThis link will expire in 15 minutes.`;
    
    // Professional HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 24px;">AlumNetX</h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h3 style="color: #333; margin-top: 0;">Password Reset Request</h3>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">Hello,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">You are receiving this email because a password reset request was made for your account.</p>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">Click the button below to reset your password. This link will safely expire in <strong>15 minutes</strong>.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; color: #777; line-height: 1.5;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">&copy; ${new Date().getFullYear()} AlumNetX. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"AlumNetX" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        text: message,
        html: htmlContent
      });
      res.status(200).send("Email sent.");
    } catch (err) {
      console.error("Forgot Password Error: ", err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).send("Email could not be sent. Please check SMTP configuration.");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// RESET PASSWORD
router.put("/reset-password/:token", async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send("Invalid or expired link");
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters.");
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      token: generateToken(user._id),
      user,
      message: "Password reset successful!"
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// DEMO QUICK LOGIN INJECTOR
router.get("/demo/:role", async (req, res) => {
  try {
    const role = req.params.role;
    let user = await User.findOne({ role }).sort({ profileCompleted: -1 });
    
    // If no user exists for this role, generate a dummy shell
    if (!user) {
      const hashed = await bcrypt.hash("demopassword", 10);
      user = new User({
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `demo_${role}@alumnetx.com`,
        password: hashed,
        role: role,
        profileCompleted: false
      });
      await user.save();
    }

    res.json({
      token: generateToken(user._id),
      user: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to bypass Demo login.");
  }
});

module.exports = router;