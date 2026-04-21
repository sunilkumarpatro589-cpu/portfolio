const http = require("http");
const moment = require("moment");

const server = http.createServer((req, res) => {

  // Home
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to My First Node.js Server");

  // About
  } else if (req.url === "/about") {
    res.end("About Page");

  // Contact
  } else if (req.url === "/contact") {
    res.end("Contact Page");

  // ✅ TIME ROUTE
  } else if (req.url === "/time") {
    res.writeHead(200, { "Content-Type": "text/plain" });

    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    res.end("Current Date & Time: " + time);

  // ✅ API ROUTE (JSON)
  } else if (req.url === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });

    const data = {
      name: "Sunil",
      role: "Node.js Developer",
      time: moment().format("YYYY-MM-DD HH:mm:ss")
    };

    res.end(JSON.stringify(data));

  // 404
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page Not Found");
  }

});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});