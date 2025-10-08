import Task from "../models/Task.js";


export const getAllTasks = async (req,res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách Task", error);
        res.status(500).json({message : "Lỗi hệ thống"});
    }
}

export const createTask = async (req,res) => {
    try {
        const {title, person, dueDate} = req.body;
        const task = new Task({title, person, dueDate});

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Lỗi khi tạo Task", error);
        res.status(500).json({message : "Lỗi hệ thống"});
    }
}

export const updateTask = async (req,res) => {
    try {
        const {title, status, completedAt, person, dueDate} = req.body;
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                person,
                dueDate,
                status,
                completedAt
            },
            {new : true}
        );
        if (!updateTask) {
            return res.status(400).json({message: "Task không tồn tại"})
        }
        res.status(200).json(updateTask);
    } catch (error) {
        console.error("Lỗi khi cập nhật Task", error);
        res.status(500).json({message : "Lỗi hệ thống"});
    }
}

export const deleteTask = async(req,res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);
        if (!deleteTask) {
            return res.status(404).json({message: "Task không tồn tại"})
        }
        res.status(200).json(deleteTask);
    } catch (error) {
        console.error("Lỗi khi xóa Task", error);
        res.status(500).json({message : "Lỗi hệ thống"});
    }
}