'use strict';

const STORAGE_KEY = 'todo.tasks.v1';

const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveTasks = (tasks) => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

let state = loadTasks();

const $form  = document.getElementById('taskForm');
const $input = document.getElementById('taskInput');
const $list  = document.getElementById('taskList');

const renderItem = (task, index) => {
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

  const remove = document.createElement('button');
  remove.className = 'btn btn-sm btn-link btn-remove p-0';
  remove.type = 'button';
  remove.innerHTML = '<i class="bi bi-x-lg"></i>';

  left.append(checkbox, text);
  li.append(left, remove);
  return li;
};

const render = () => {
  const frag = document.createDocumentFragment();
  $list.innerHTML = '';
  state.forEach((t, i) => frag.appendChild(renderItem(t, i)));
  $list.appendChild(frag);
};

const commit = () => { saveTasks(state); render(); };

const addTask = (text) => {
  const t = text.trim();
  if (!t) return;
  state = [...state, { text: t, completed: false }];
  commit();
};

const toggleTaskByIndex = (idx) => {
  if (idx < 0 || idx >= state.length) return;
  state[idx].completed = !state[idx].completed;
  commit();
};

const removeTaskByIndex = (idx) => {
  if (idx < 0 || idx >= state.length) return;
  state.splice(idx, 1);
  commit();
};

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask($input.value);
  $input.value = '';
  $input.focus();
});

$list.addEventListener('click', (e) => {
  const li = e.target.closest('li.list-group-item');
  if (!li) return;
  const idx = Number(li.dataset.index);
  if (e.target.closest('.form-check-input')) toggleTaskByIndex(idx);
  else if (e.target.closest('.btn-remove')) removeTaskByIndex(idx);
});

render();
