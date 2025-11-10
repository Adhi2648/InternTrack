const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Register (simple - for dev only)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password required" });
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(409).json({ message: "username already exists" });
    const user = await User.createWithPassword(username, password);
    const token = jwt.sign(
      { sub: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password required" });
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "invalid credentials" });
    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ message: "invalid credentials" });
    const token = jwt.sign(
      { sub: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
