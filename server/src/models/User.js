const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.createWithPassword = async function (username, password) {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return this.create({ username, passwordHash });
};

module.exports = mongoose.model("User", UserSchema);
