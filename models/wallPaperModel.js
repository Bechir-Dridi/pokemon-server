const mongoose = require("mongoose");

const wallPaperSchema = new mongoose.Schema({
    filename: { type: String, required: true }
})

const wallPaperModel = mongoose.model("wallPaper", wallPaperSchema);

module.exports = wallPaperModel;