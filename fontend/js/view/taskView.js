export const taskView = {
  renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => this.appendTask(task));
  },
  appendTask(task) {
    const li = document.createElement("li");
    li.textContent = `<span class="task"> ${task.title}</span>`;
    document.getElementById("taskList").appendChild(li);
  },
  getInputValue() {
    return document.getElementById("taskName").value.trim();
  },
  clearInput() {
    document.getElementById("taskName").value = "";
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
