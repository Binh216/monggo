export const taskView = {
  renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => this.appendTask(task));
  },
  appendTask(task) {
    const li = this.createTaskElement(task);
    document.getElementById("taskList").appendChild(li);
  },
  createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task._id || task.id;

    const checked = task.status === 'complete' ? 'checked' : '';
    const completedClass = task.status === 'complete' ? 'task-complete' : '';

    li.innerHTML = `
      <label>
        <input type="checkbox" class="task-checkbox" data-id="${li.dataset.id}" ${checked} />
        <span class="task ${completedClass}"> ${task.title}</span>
      </label>
      <div class="task-meta">
        <span class="person">${task.person ? task.person : ''}</span>
        <span class="due">${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-id="${li.dataset.id}"><i class="fa-solid fa-pencil"></i></button>
        <button class="delete-btn" data-id="${li.dataset.id}"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    return li;
  },
  getInputValue() {
    return document.getElementById("taskName").value.trim();
  },
  clearInput() {
    document.getElementById("taskName").value = "";
    const p = document.getElementById("taskPerson");
    if (p) p.value = "";
  },
  bindAddTask(handler) {
    document.getElementById("addTaskBtn").addEventListener("click", () => {
      const taskText = this.getInputValue();
      if (taskText) {
        handler(taskText);
        this.clearInput();
      }
    });
  }
};
