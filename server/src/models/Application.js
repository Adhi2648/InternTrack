const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: "Applied" },
  dateApplied: { type: Date, default: Date.now },
  nextStep: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ApplicationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Application", ApplicationSchema);
