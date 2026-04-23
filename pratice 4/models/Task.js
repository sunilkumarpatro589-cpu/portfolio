const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    enum: ["Work", "Personal", "Urgent"],
    default: "Personal"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);