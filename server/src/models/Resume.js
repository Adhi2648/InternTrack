const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    default: "v1.0",
  },
  filePath: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  tags: [
    {
      type: String,
    },
  ],
  usedBy: [
    {
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
      company: String,
      role: String,
      appliedAt: Date,
    },
  ],
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
ResumeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Resume", ResumeSchema);
