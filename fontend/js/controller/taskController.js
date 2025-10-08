import { taskModel } from "../model/taskModel.js";
import { taskView } from "../view/taskView.js";

export const taskController = {
  async init() {
    const tasks = await taskModel.getTasks();
    taskView.renderTasks(tasks);
    taskView.bindAddTask(this.handleAddTask.bind(this));
  },
  async handleAddTask(taskText) {
    const newTask = await taskModel.addTask(taskText);
    taskView.appendTask(newTask);
  }
};
