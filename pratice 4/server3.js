const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// CONNECT MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/taskapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* =========================
   TASK SCHEMA
========================= */
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },

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

const Task = mongoose.model("Task", taskSchema);

/* =========================
   ROUTES
========================= */

// HOME
app.get("/", (req, res) => {
  res.send("Task API Running 🚀");
});

// CREATE TASK
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET TASKS (SORTED BY DATE)
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE TASK (EDIT TITLE)
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ========================= */

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});