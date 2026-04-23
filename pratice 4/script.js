const API = "http://localhost:3000";

/* ================= PROTECT DASHBOARD ================= */
if (window.location.pathname.includes("index.html")) {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
  } else {
    loadUsers();
  }
}

/* ================= LOGIN ================= */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } else {
    alert("Login failed");
  }
}

/* ================= SIGNUP ================= */
async function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(`${API}/signup`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password })
  });

  alert("Signup successful");
  window.location.href = "login.html";
}

/* ================= LOAD USERS ================= */
async function loadUsers() {
  const res = await fetch(`${API}/users`, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  const users = await res.json();
  displayUsers(users);
}

/* ================= DISPLAY USERS ================= */
function displayUsers(users) {
  const container = document.getElementById("users");
  container.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user";

    div.innerHTML = `${user.name} (${user.email})`;

    container.appendChild(div);
  });
}

/* ================= SEARCH ================= */
async function searchUser() {
  const name = document.getElementById("search").value;

  const res = await fetch(`${API}/users/search?name=${name}`, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  const users = await res.json();
  displayUsers(users);
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}