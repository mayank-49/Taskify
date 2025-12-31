import express from "express";
import { addTask, deleteTask, editTask, getTasks, toggleStatus } from "../controllers/taskController.js";
import { userAuth } from "../middlewares/authUser.js";

const taskRouter = express.Router();

taskRouter.post('/add',userAuth , addTask);
taskRouter.post('/add',userAuth , addTask);
taskRouter.get('/get',userAuth , getTasks);
taskRouter.patch('/:id',userAuth , editTask);
taskRouter.delete('/:id/delete',userAuth , deleteTask);
taskRouter.patch("/:id/toggle", userAuth, toggleStatus);

export default taskRouter