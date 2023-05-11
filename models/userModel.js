const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "user" }
})
const User = mongoose.model("user", userSchema);

module.exports = User;