const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <input type="checkbox" class="form-check-input complete-checkbox" ${task.completed ? "checked" : ""}>
        <span class="task-text">${task.text}</span>
      </div>
      <button class="btn btn-sm btn-link delete-btn text-danger" title="Delete">
        <i class="bi bi-trash"></i>
      </button>
    `;

    li.querySelector(".complete-checkbox").addEventListener("change", () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    taskList.appendChild(li);
  });
}

function addTask(text) {
  const t = text.trim();
  if (!t) return;
  tasks.push({ text: t, completed: false });
  saveAndRender();
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

renderTasks();
