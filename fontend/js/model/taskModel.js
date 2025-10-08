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
  async addTask(name) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: name })
    });
    if (!response.ok) throw new Error(`addTask failed: ${response.status} ${response.statusText}`);
    return await response.json();
  }
};
