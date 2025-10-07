import express from 'express';
import { 
    createTask, 
    updateTask,
    deleteTask, 
    getAllTasks 
} from '../controllers/tasksControlers.js';

const router = express.Router();

router.get("/", getAllTasks)

router.post("/", createTask)

router.put("/:id", updateTask)

router.delete("/:id", deleteTask)

export default router;