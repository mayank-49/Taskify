import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors"
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// const allowedOrigins = ["http://localhost:5173", "https://taskify-frontend-eqr2.onrender.com"];

//middleware configurations
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: true, credentials: true}));


app.get('/',(req,res)=>{
    res.send("API Working");
})

app.use('/api/user',userRouter)
app.use('/api/task', taskRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`)
})