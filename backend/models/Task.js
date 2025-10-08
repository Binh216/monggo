import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title :{
            type : String,
            require : true,
            trim : true
        },
        // optional due date for the task
        dueDate: {
            type: Date,
            default: null
        },
        status : {
            type : String,
            enum: ["active","complete"],
            default:"active"
        },
        completedAt:{
            type:Date,
            default:null
        }
    },
    {
        timestamps:true
    }
)

const Task = mongoose.model("Task", taskSchema);
export default Task;