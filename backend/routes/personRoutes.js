import express from 'express';
import { getAllPersons, createPerson } from '../controllers/personControllers.js';

const router = express.Router();

router.get('/', getAllPersons);
router.post('/', createPerson);

export default router;
