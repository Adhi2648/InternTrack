const express = require("express");
const jwt = require("jsonwebtoken");
const Resume = require("../models/Resume");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// GET all resumes for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single resume
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new resume
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, version, filePath, description, tags, isDefault } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await Resume.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const resume = new Resume({
      userId: req.userId,
      name,
      version: version || "v1.0",
      filePath,
      description: description || "",
      tags: tags || [],
      isDefault: isDefault || false,
      usedBy: [],
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update resume
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, version, filePath, description, tags, isDefault } = req.body;

    // If setting as default, unset other defaults first
    if (isDefault) {
      await Resume.updateMany(
        { userId: req.userId, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        name,
        version,
        filePath,
        description,
        tags,
        isDefault,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT add application to resume's usedBy list
router.put("/:id/used-by", authMiddleware, async (req, res) => {
  try {
    const { applicationId, company, role } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        $push: {
          usedBy: {
            applicationId,
            company,
            role,
            appliedAt: new Date(),
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE resume
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json({ message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
