const PERSON_API = 'http://127.0.0.1:5001/api/persons';

export const personModel = {
  async getPersons() {
    const res = await fetch(PERSON_API, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('Failed to load persons');
    return await res.json();
  },
  async addPerson(name) {
    const res = await fetch(PERSON_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`addPerson failed: ${res.status} ${txt}`);
    }
    return await res.json();
  }
};
