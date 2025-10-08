// Use relative path so a local dev proxy (or same-origin backend) can be used to avoid CORS.
// During development you can run the included dev-proxy which forwards /api to the real API.
const API_URL = "http://127.0.0.1:5001/api/tasks"; // relative path

export const taskModel = {
  async getTasks() {
    // Do not set Access-Control-Allow-Origin on the request — that header must be provided by the server.
    const response = await fetch(API_URL, { method: "GET", headers: { "Content-Type": "application/json" } });
    // If response.ok is false, throw to allow the caller to handle errors.
    if (!response.ok) throw new Error(`getTasks failed: ${response.status} ${response.statusText}`);
    return await response.json();
  },
  async addTask(name, person, dueDate) {
    const body = { title: name };
    if (typeof person !== 'undefined' && person !== null) body.person = person;
    if (typeof dueDate !== 'undefined' && dueDate !== null && dueDate !== '') body.dueDate = dueDate;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`addTask failed: ${response.status} ${response.statusText}`);
    return await response.json();
  }
  ,
  async updateTaskStatus(id, completed) {
    const status = completed ? 'complete' : 'active';
    const completedAt = completed ? new Date().toISOString() : null;
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, completedAt })
    });
    if (!response.ok) throw new Error(`updateTaskStatus failed: ${response.status} ${response.statusText}`);
    return await response.json();
  }
  ,
  async updateTask(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`updateTask failed: ${response.status} ${response.statusText}`);
    return await response.json();
  },
  async deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`deleteTask failed: ${response.status} ${response.statusText}`);
    return await response.json();
  }
};
