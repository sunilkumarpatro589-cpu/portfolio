const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

const User = require("./models/User");
const Task = require("./models/Task");
const auth = require("./middleware/auth");

// CONNECT DB
mongoose.connect("mongodb://127.0.0.1:27017/taskapp")
  .then(() => console.log("MongoDB Connected"));

/* ================= AUTH ================= */

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashed });
  await user.save();

  res.json({ message: "User created" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secretkey");
  res.json({ token });
});

/* ================= USERS ================= */

app.get("/users", auth, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

app.get("/users/search", auth, async (req, res) => {
  const name = req.query.name;

  const users = await User.find({
    name: { $regex: name, $options: "i" }
  }).select("-password");

  res.json(users);
});

/* ================= TASKS ================= */

// CREATE TASK
app.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    userId: req.user.id
  });

  await task.save();
  res.json(task);
});

// GET TASKS (SORTED)
app.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(tasks);
});

// UPDATE TASK
app.put("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true }
  );

  res.json(task);
});

// DELETE TASK
app.delete("/tasks/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});