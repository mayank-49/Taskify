import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log(`Database connected successfully`)
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/taskmanager`);
    } catch (error) {
        console.log("Mongo db connection failed: ", error.message);
        process.exit(1);
    }
};

export default connectDB;