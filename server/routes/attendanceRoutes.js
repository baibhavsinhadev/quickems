import { Router } from 'express';
import { clockInOut, getAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middlewares/auth.js';

const attendanceRouter = Router();

attendanceRouter.post("/", protect, clockInOut);
attendanceRouter.get("/", protect, getAttendance);

export default attendanceRouter;