const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const User = require("./models1/User");
const Product = require("./models1/Product");

// CONNECT DB
mongoose.connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* =========================
   USER ROUTES
========================= */

// CREATE USER
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL USERS
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET USER BY ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// UPDATE USER
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE USER
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});


/* =========================
   EXTRA (ASSIGNMENT)
========================= */

// GET ADMINS
app.get("/users/admins", async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.json(admins);
});

// USERS BETWEEN AGE 20–30
app.get("/users/age-range", async (req, res) => {
  const users = await User.find({
    age: { $gte: 20, $lte: 30 }
  });
  res.json(users);
});

// AVERAGE AGE
app.get("/users/average-age", async (req, res) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        avgAge: { $avg: "$age" }
      }
    }
  ]);

  res.json({ averageAge: result[0]?.avgAge || 0 });
});


/* =========================
   PRODUCT ROUTES
========================= */

// CREATE PRODUCT
app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// GET PRODUCTS
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// UPDATE PRODUCT
app.put("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

// DELETE PRODUCT
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});


/* ========================= */

app.get("/", (req, res) => {
  res.send("Day 15 API Running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});