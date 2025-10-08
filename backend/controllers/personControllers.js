import Person from '../models/Person.js';

export const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json(persons);
  } catch (err) {
    console.error('Error fetching persons', err);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

export const createPerson = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name required' });
    const existing = await Person.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ message: 'Person already exists' });
    const person = new Person({ name: name.trim() });
    const saved = await person.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating person', err);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};
