const STORAGE_KEY = 'todo.tasks.v1';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();
const form  = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const list  = document.getElementById('taskList');

function createItem(task, index) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex align-items-center justify-content-between px-3 py-3 mb-3';
  li.dataset.index = index;

  if (task.completed) li.classList.add('completed');

  const left = document.createElement('div');
  left.className = 'd-flex align-items-center gap-3';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input';
  checkbox.checked = !!task.completed;

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-sm btn-link btn-remove p-0';
  btn.innerHTML = '<i class="bi bi-x-lg"></i>';

  left.appendChild(checkbox);
  left.appendChild(text);
  li.appendChild(left);
  li.appendChild(btn);

  return li;
}

function render() {
  list.innerHTML = '';
  for (let i = 0; i < tasks.length; i++) {
    list.appendChild(createItem(tasks[i], i));
  }
  saveTasks(tasks);
}

function addTask(text) {
  const t = text.trim();
  if (!t) return;
  tasks.push({ text: t, completed: false });
  render();
}

function toggleTask(index) {
  if (index < 0 || index >= tasks.length) return;
  tasks[index].completed = !tasks[index].completed;
  render();
}

function removeTask(index) {
  if (index < 0 || index >= tasks.length) return;
  tasks.splice(index, 1);
  render();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

list.addEventListener('click', function (e) {
  const li = e.target.closest('li.list-group-item');
  if (!li) return;
  const index = Number(li.dataset.index);

  if (e.target.closest('.form-check-input')) {
    toggleTask(index);
  } else if (e.target.closest('.btn-remove')) {
    removeTask(index);
  }
});

render();
