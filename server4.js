const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// IMPORT MODELS
const User = require("./models/User");
const Product = require("./models/Product");

// CONNECT MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* =======================
   USER ROUTES
======================= */

// CREATE USER
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL USERS
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET ACTIVE USERS
app.get("/users/active", async (req, res) => {
  const users = await User.find({ isActive: true });
  res.json(users);
});

// GET USERS BY AGE
app.get("/users/age/:min", async (req, res) => {
  const users = await User.find({
    age: { $gt: req.params.min }
  });
  res.json(users);
});

// UPDATE USER
app.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
});

// DELETE USER
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});


/* =======================
   PRODUCT ROUTES
======================= */

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


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});