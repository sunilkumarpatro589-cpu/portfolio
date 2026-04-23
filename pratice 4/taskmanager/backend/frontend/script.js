const API = "http://localhost:3000";

// LOGIN
async function login() {
  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  localStorage.setItem("token", data.token);
  location.href = "index.html";
}

// SIGNUP
async function signup() {
  await fetch(API + "/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    })
  });

  location.href = "login.html";
}

// LOAD TASKS
async function loadTasks() {
  const res = await fetch(API + "/tasks", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  const tasks = await res.json();

  tasksDiv.innerHTML = "";

  tasks.forEach(t => {
    tasksDiv.innerHTML += `
      ${t.title} (${t.category})
      <button onclick="editTask('${t._id}')">Edit</button>
      <button onclick="deleteTask('${t._id}')">Delete</button><br>
    `;
  });
}

// ADD TASK
async function addTask() {
  await fetch(API + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({
      title: title.value,
      category: category.value
    })
  });

  loadTasks();
}

// EDIT
async function editTask(id) {
  const newTitle = prompt("New title");

  await fetch(API + "/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ title: newTitle })
  });

  loadTasks();
}

// DELETE
async function deleteTask(id) {
  await fetch(API + "/tasks/" + id, {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  loadTasks();
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

// LOAD ON START
if (location.pathname.includes("index.html")) {
  loadTasks();
}