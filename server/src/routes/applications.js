const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const jwt = require("jsonwebtoken");

// Middleware to extract user from Authorization header
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "missing authorization" });
  const parts = auth.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "invalid authorization header" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid token" });
  }
}

// List applications for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// Create
router.post("/", authMiddleware, async (req, res) => {
  try {
    const payload = req.body || {};
    const app = await Application.create({
      userId: req.user.id,
      companyName: payload.companyName || "",
      role: payload.role || "",
      status: payload.status || "Applied",
      dateApplied: payload.dateApplied
        ? new Date(payload.dateApplied)
        : Date.now(),
      nextStep: payload.nextStep || "",
    });
    res.status(201).json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// Update
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body || {};
    const app = await Application.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      update,
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "not found" });
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Application.deleteOne({
      _id: id,
      userId: req.user.id,
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
