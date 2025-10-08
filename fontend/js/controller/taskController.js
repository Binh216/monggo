import { taskModel } from "../model/taskModel.js";
import { personModel } from "../model/personModel.js";
import { taskView } from "../view/taskView.js";

export const taskController = {
  async init() {
    const tasks = await taskModel.getTasks();
    // load people
    const people = await personModel.getPersons();
    this.renderPeople(people);
    // split tasks into assigned vs todo
    const assignedList = document.getElementById('assignedList');
    const taskList = document.getElementById('taskList');
    assignedList.innerHTML = '';
    taskList.innerHTML = '';
    tasks.forEach(t => {
      if (t.person) {
        document.getElementById('assignedList').appendChild(taskView.createTaskElement(t));
      } else {
        document.getElementById('taskList').appendChild(taskView.createTaskElement(t));
      }
    });
  taskView.bindAddTask(this.handleAddTask.bind(this));
  this.setupMenu();
    // wire add person button
    document.getElementById('addPersonBtn').addEventListener('click', async () => {
      const name = document.getElementById('newPersonName').value.trim();
      if (!name) return alert('Vui lòng nhập tên');
      try {
        const p = await personModel.addPerson(name);
        document.getElementById('newPersonName').value = '';
        this.addPersonToUI(p);
      } catch (err) {
        alert(err.message || 'Could not add person');
      }
    });
    // delegate change events for checkboxes
    document.getElementById('taskList').addEventListener('change', async (e) => {
      if (e.target && e.target.classList.contains('task-checkbox')) {
        const id = e.target.dataset.id;
        const completed = e.target.checked;
        await this.handleToggleTask(id, completed, e.target);
      }
    });
    // delegate click events for edit/delete/save/cancel (with person support)
    document.getElementById('taskList').addEventListener('click', async (e) => {
      const el = e.target;
      const li = el.closest('li');
      if (!li) return;

      // Enter inline edit mode (title + person)
      if (el.classList.contains('edit-btn')) {
        const id = el.dataset.id;
        const titleSpan = li.querySelector('.task');
        const currentTitle = titleSpan.textContent.trim();
        const currentPerson = li.querySelector('.person')?.textContent.trim() || '';

        // hide title/person and insert inputs
        titleSpan.style.display = 'none';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = currentTitle;
        titleSpan.parentElement.insertBefore(input, titleSpan.nextSibling);

        const personSpan = li.querySelector('.person');
        if (personSpan) personSpan.style.display = 'none';
        // create select cloned from global person select
        const globalSelect = document.getElementById('taskPersonSelect');
        const personSelect = document.createElement('select');
        personSelect.className = 'edit-person-input';
        // copy options
        Array.from(globalSelect.options).forEach(opt => {
          const o = document.createElement('option');
          o.value = opt.value;
          o.textContent = opt.textContent;
          personSelect.appendChild(o);
        });
        personSelect.value = currentPerson;
        li.querySelector('.task-meta').appendChild(personSelect);

        // replace actions with Save / Cancel
        const actions = li.querySelector('.task-actions');
        actions.innerHTML = `
          <button class="save-btn" data-id="${id}">Save</button>
          <button class="cancel-btn" data-id="${id}">Cancel</button>
        `;
        input.focus();
        input.select();
        return;
      }

      // Save inline edit (title + person)
      if (el.classList.contains('save-btn')) {
        const id = el.dataset.id;
        const input = li.querySelector('.edit-input');
        const personInput = li.querySelector('.edit-person-input');
        if (!input) return;
        const newTitle = input.value.trim();
        if (newTitle === '') {
          alert('Title cannot be empty');
          input.focus();
          return;
        }
        const newPerson = personInput ? personInput.value.trim() : undefined;
        await this.handleEditTask(id, newTitle, el, newPerson);
        return;
      }

      // Cancel inline edit
      if (el.classList.contains('cancel-btn')) {
        const actions = li.querySelector('.task-actions');
        const titleSpan = li.querySelector('.task');
        const id = el.dataset.id;
        // remove inputs and restore span/person
        const input = li.querySelector('.edit-input');
        const personInput = li.querySelector('.edit-person-input');
        if (input) input.remove();
        if (personInput) personInput.remove();
        titleSpan.style.display = '';
        const personSpan = li.querySelector('.person');
        if (personSpan) personSpan.style.display = '';
        // restore actions
        actions.innerHTML = `
          <button class="edit-btn" data-id="${id}">Edit</button>
          <button class="delete-btn" data-id="${id}">Delete</button>
        `;
        return;
      }

      // Delete
      if (el.classList.contains('delete-btn')) {
        const id = el.dataset.id;
        if (confirm('Are you sure you want to delete this task?')) {
          await this.handleDeleteTask(id, el);
        }
      }
    });
  },

  setupMenu() {
    const menu = document.querySelectorAll('.top-menu .menu-item');
    menu.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        // hide all sections
        document.querySelectorAll('section[id$="Panel"]').forEach(s => s.style.display = 'none');
        const el = document.getElementById(target);
        if (el) el.style.display = '';
      });
    });
  },
  async handleAddTask(taskText) {
    const person = document.getElementById('taskPersonSelect')?.value || undefined;
    const due = document.getElementById('taskDue')?.value || undefined;
    const newTask = await taskModel.addTask(taskText, person || undefined, due || undefined);
  // clear inputs after adding
  const sel = document.getElementById('taskPersonSelect'); if (sel) sel.value = '';
  document.getElementById('taskDue').value = '';
    // append to correct list
    if (newTask.person) document.getElementById('assignedList').appendChild(taskView.createTaskElement(newTask));
    else document.getElementById('taskList').appendChild(taskView.createTaskElement(newTask));
  }
,
  async handleToggleTask(id, completed, inputEl) {
    // optimistic UI update
    const titleSpan = inputEl.closest('label').querySelector('.task');
    if (completed) {
      titleSpan.classList.add('task-complete');
    } else {
      titleSpan.classList.remove('task-complete');
    }

    try {
      await taskModel.updateTaskStatus(id, completed);
    } catch (err) {
      // revert UI on error
      inputEl.checked = !completed;
      if (!completed) titleSpan.classList.add('task-complete'); else titleSpan.classList.remove('task-complete');
      console.error('Failed to update task status', err);
      alert('Could not update task status');
    }
  }
,
  async handleEditTask(id, newTitle, el, newPerson) {
    const li = el.closest('li');
    const titleSpan = li.querySelector('.task');
    const input = li.querySelector('.edit-input');
    const personSpan = li.querySelector('.person');
    const personInput = li.querySelector('.edit-person-input');
    try {
      const payload = { title: newTitle };
      if (typeof newPerson !== 'undefined') payload.person = newPerson;
      const updated = await taskModel.updateTask(id, payload);
      // update view: remove inputs, show span with new text/person
      if (input) input.remove();
      if (personInput) personInput.remove();
      titleSpan.textContent = ` ${updated.title}`;
      titleSpan.style.display = '';
      if (personSpan) {
        personSpan.textContent = updated.person ? updated.person : '';
        personSpan.style.display = '';
      }
      // restore actions
      const actions = li.querySelector('.task-actions');
      actions.innerHTML = `
        <button class="edit-btn" data-id="${id}">Edit</button>
        <button class="delete-btn" data-id="${id}">Delete</button>
      `;
    } catch (err) {
      console.error('Failed to edit task', err);
      alert('Could not edit task');
      // keep input for user to retry
      if (input) input.focus();
    }
  },
  async handleDeleteTask(id, el) {
    try {
      await taskModel.deleteTask(id);
      // remove from DOM
      const li = el.closest('li');
      li.parentElement.removeChild(li);
    } catch (err) {
      console.error('Failed to delete task', err);
      alert('Could not delete task');
    }
  }
,
  renderPeople(people) {
    const peopleList = document.getElementById('peopleList');
    const select = document.getElementById('taskPersonSelect');
    peopleList.innerHTML = '';
    // reset select (keep default)
    select.innerHTML = '<option value="">(Chọn người thực hiện)</option>';
    people.forEach(p => this.addPersonToUI(p));
  },
  addPersonToUI(p) {
    const peopleList = document.getElementById('peopleList');
    const li = document.createElement('li');
    li.textContent = p.name;
    peopleList.appendChild(li);
    const select = document.getElementById('taskPersonSelect');
    const opt = document.createElement('option');
    opt.value = p.name;
    opt.textContent = p.name;
    select.appendChild(opt);
  }
};
