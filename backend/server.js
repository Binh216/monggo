import express from 'express';
import taskRoute from './routes/tasksRoutes.js'
import { connectDB } from './config/db.js';
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const app = express();



app.use(express.json());

app.use("/api/tasks", taskRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    })
});


