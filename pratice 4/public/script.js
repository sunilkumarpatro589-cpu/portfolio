const userId = ""; // optional (can leave empty)

async function addTask() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;

  await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, category, userId })
  });

  loadTasks();
}

async function loadTasks() {
  const res = await fetch("/tasks");
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${task.title} (${task.category})
      <button onclick="editTask('${task._id}')">Edit</button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;

    list.appendChild(li);
  });
}

async function editTask(id) {
  const title = prompt("New title:");

  await fetch(`/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: "DELETE" });
  loadTasks();
}

loadTasks();