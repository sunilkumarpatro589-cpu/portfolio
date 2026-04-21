const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware (logging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Dummy database
let users = [
  { id: 1, name: "Rahul", age: 22, email: "rahul@gmail.com" },
  { id: 2, name: "Aditi", age: 17, email: "aditi@gmail.com" },
  { id: 3, name: "Sunil", age: 25, email: "sunil@gmail.com" }
];


// ✅ GET all users
app.get("/users", (req, res) => {
  res.json(users);
});


// ✅ GET user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});


// ✅ POST (Create user)
app.post("/users", (req, res) => {
  const { name, age, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).json({ error: "All fields required" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    age,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
});


// ✅ PUT (Update user)
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.age = req.body.age || user.age;
  user.email = req.body.email || user.email;

  res.json(user);
});


// ✅ DELETE user
app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.json({ message: "User deleted" });
});


// 🔍 ASSIGNMENT 1: Search by name
app.get("/users/search", (req, res) => {
  const name = req.query.name;

  const result = users.filter(u =>
    u.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(result);
});


// 👨‍🦱 ASSIGNMENT 2: Adults (age ≥ 18)
app.get("/users/adults", (req, res) => {
  const adults = users.filter(u => u.age >= 18);
  res.json(adults);
});


// 📧 ASSIGNMENT 3: Only emails
app.get("/users/emails", (req, res) => {
  const emails = users.map(u => u.email);
  res.json(emails);
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});