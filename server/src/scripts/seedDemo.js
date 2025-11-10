require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Application = require("../models/Application");

async function seed() {
  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/interntrack_dev";
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to", uri);

  // Create demo user if not exists
  let user = await User.findOne({ username: "demo" });
  if (!user) {
    user = await User.createWithPassword("demo", "demo");
    console.log("Created demo user: demo");
  } else {
    console.log("Demo user already exists");
  }

  // Create sample applications
  const apps = [
    {
      userId: user._id,
      companyName: "Acme Corp",
      role: "Software Intern",
      status: "Applied",
      dateApplied: new Date(),
      nextStep: "Follow-up email",
    },
    {
      userId: user._id,
      companyName: "Globex",
      role: "Frontend Intern",
      status: "Interview",
      dateApplied: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      nextStep: "Technical interview",
    },
  ];

  for (const a of apps) {
    // avoid duplicates by company + role
    const exists = await Application.findOne({
      userId: user._id,
      companyName: a.companyName,
      role: a.role,
    });
    if (!exists) {
      await Application.create(a);
      console.log("Inserted application for", a.companyName);
    } else {
      console.log("Application already exists for", a.companyName);
    }
  }

  // print a JWT for convenience
  const token = jwt.sign(
    { sub: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  console.log("\nDemo user token (use as Authorization: Bearer <token>):");
  console.log(token);

  await mongoose.disconnect();
  console.log("\nSeeding complete.");
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
