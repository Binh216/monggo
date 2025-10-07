import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("DB connect successfull")
    } catch (error) {
        console.error("Lỗi kết nối DB:",error);
        process.exit(1);
    }
}