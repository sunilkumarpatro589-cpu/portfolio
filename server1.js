const express = require("express");
const app = express();
const PORT = 3000;

// Middleware (JSON parsing)
app.use(express.json());

// Middleware (logging + time)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Serve static files
app.use(express.static("public"));

// Dummy data
let users = [
  { id: 1, name: "Rahul" },
  { id: 2, name: "Aditi" }
];

// Home
app.get("/", (req, res) => {
  res.send("Welcome to Express Info Server");
});

// About
app.get("/about", (req, res) => {
  res.send("About My Express Project");
});

// Contact
app.get("/contact", (req, res) => {
  res.send("Contact us at: sunil@email.com");
});


// ✅ 1. WEATHER ROUTE
app.get("/weather/:city", (req, res) => {
  res.json({
    city: req.params.city,
    temp: "30°C"
  });
});


// ✅ 2. GET USERS
app.get("/api/users", (req, res) => {
  res.json(users);
});


// ✅ 3. POST USER (ADD USER)
app.post("/api/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);

  res.json({
    message: "User added successfully",
    user: newUser
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});