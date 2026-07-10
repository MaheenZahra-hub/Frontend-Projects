(() => {
  const STORAGE_KEY = 'fieldnotes.tasks';

  const addForm = document.getElementById('addForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const emptyText = document.getElementById('emptyText');
  const statsText = document.getElementById('statsText');
  const progressFill = document.getElementById('progressFill');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const accessibilityAnnouncer = document.getElementById('accessibilityAnnouncer');
  
  const mascotCompanion = document.getElementById('mascotCompanion');
  const mascotBubble = document.getElementById('mascotBubble');

  const confirmModal = document.getElementById('confirmModal');
  const confirmModalBtn = document.getElementById('confirmModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  let tasks = loadTasks();
  let currentFilter = 'all';

  const MASCOT_PHRASES = [
    "Smells like fresh coffee!",
    "Doing wonderful.",
    "Let's check them off!",
    "Even a single word is progress.",
    "A cozy little list.",
    "Time for a pastry break!"
  ];

  function triggerMascotSpeech(text) {
    mascotBubble.textContent = text || MASCOT_PHRASES[Math.floor(Math.random() * MASCOT_PHRASES.length)];
    mascotCompanion.classList.add('active');
    setTimeout(() => mascotCompanion.classList.remove('active'), 2500);
  }

  function announceToScreenReader(message) {
    accessibilityAnnouncer.textContent = message;
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Could not read saved tasks:', e);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Could not save tasks:', e);
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        alert('Your notebook storage space is full. Please remove old entries to clear space.');
      }
    }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    tasks.unshift({ id: uid(), text: trimmed, completed: false, createdAt: Date.now() });
    saveTasks();
    announceToScreenReader(`Task "${trimmed}" added successfully.`);
    
    // Task addition micro-state: trigger stem growing elastic animation
    mascotCompanion.classList.add('grow-stem');
    setTimeout(() => mascotCompanion.classList.remove('grow-stem'), 500);

    triggerMascotSpeech("Added to the log!");
    render();
  }

  function toggleTask(id) {
    const t = tasks.find(t => t.id === id);
    if (t) {
      t.completed = !t.completed;
      announceToScreenReader(`Task "${t.text}" marked as ${t.completed ? 'completed' : 'active'}.`);
      if (t.completed) triggerMascotSpeech("The sweetest satisfaction.");
    }
    saveTasks();
    render();
  }

  function deleteTask(id) {
    const t = tasks.find(t => t.id === id);
    const textSnapshot = t ? t.text : 'Unknown';
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    announceToScreenReader(`Task "${textSnapshot}" deleted.`);
    render();
  }

  function editTask(id, newText) {
    const trimmed = newText.trim();
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    if (trimmed) {
      t.text = trimmed;
      saveTasks();
      announceToScreenReader(`Task text updated to "${trimmed}".`);
    }
    render();
  }

  function clearCompleted() {
    const countCleared = tasks.filter(t => t.completed).length;
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    announceToScreenReader(`Cleared ${countCleared} completed tasks.`);
    triggerMascotSpeech("Clean and tidy!");
    render();
  }

  function getFiltered() {
    if (currentFilter === 'active') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }

  function createTaskEl(task) {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const check = document.createElement('button');
    check.className = 'check';
    check.type = 'button';
    check.setAttribute('aria-label', task.completed ? 'Mark as not done' : 'Mark as done');
    check.innerHTML = `<svg viewBox="0 0 14 14" fill="none"><path d="M2.5 7.2L5.4 10L11.5 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    check.addEventListener('click', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    span.title = 'Double‑click to edit';
    span.addEventListener('dblclick', () => enterEditMode(li, task));

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn edit';
    editBtn.type = 'button';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M11.3 2.3a1.4 1.4 0 0 1 2 2L5 12.6l-2.7.7.7-2.7 8.3-8.3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
    editBtn.addEventListener('click', () => enterEditMode(li, task));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn delete';
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5l.6 8.2a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.append(editBtn, delBtn);
    li.append(check, span, actions);
    return li;
  }

  function enterEditMode(li, task) {
    if (li.querySelector('.edit-input')) return;
    const span = li.querySelector('.task-text');
    const actions = li.querySelector('.task-actions');

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;
    input.maxLength = 140;

    span.replaceWith(input);
    actions.style.display = 'none';
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    const commit = () => editTask(task.id, input.value);
    const cancel = () => render();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') cancel();
    });
    input.addEventListener('blur', commit);
  }

  function render() {
    const filtered = getFiltered();
    taskList.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.hidden = false;
      if (tasks.length === 0) {
        emptyText.textContent = 'Nothing planted yet. Add your first task above.';
      } else if (currentFilter === 'active') {
        emptyText.textContent = 'Everything here is done. Nicely kept.';
      } else {
        emptyText.textContent = 'No entries in this view yet.';
      }
    } else {
      emptyState.hidden = true;
      const frag = document.createDocumentFragment();
      filtered.forEach(t => frag.appendChild(createTaskEl(t)));
      taskList.appendChild(frag);
    }

    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    statsText.textContent = total === 0
      ? '0 of 0 tasks done'
      : `${done} of ${total} task${total === 1 ? '' : 's'} done`;
    
    // Compute exact progression matrix
    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
    progressFill.style.width = `${percentage}%`;
    clearCompletedBtn.hidden = done === 0;

    // Victory Condition Event Handler State: 100% Complete gives mascot happy eyes (^ ^)
    if (percentage === 100 && total > 0) {
      mascotCompanion.classList.add('victory-eyes');
    } else {
      mascotCompanion.classList.remove('victory-eyes');
    }
  }

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';
    taskInput.focus();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  mascotCompanion.addEventListener('click', () => triggerMascotSpeech());

  clearCompletedBtn.addEventListener('click', () => confirmModal.showModal());
  confirmModalBtn.addEventListener('click', () => { clearCompleted(); confirmModal.close(); });
  cancelModalBtn.addEventListener('click', () => confirmModal.close());

  render();
})();