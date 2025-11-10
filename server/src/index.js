require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const applicationsRoutes = require("./routes/applications");

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

async function start() {
  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/interntrack_dev";
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
  app.listen(PORT, () => {
    console.log(`InternTrack server listening on http://localhost:${PORT}`);
  });
}

start();
