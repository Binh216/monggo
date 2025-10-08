import express from 'express';
import cors from 'cors';
import taskRoute from './routes/tasksRoutes.js'
import personRoute from './routes/personRoutes.js'
import { connectDB } from './config/db.js';
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();



app.use(express.json());
// enable CORS so frontend can call API from another origin/file
app.use(cors());

app.use("/api/tasks", taskRoute);
app.use("/api/persons", personRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    })
});


