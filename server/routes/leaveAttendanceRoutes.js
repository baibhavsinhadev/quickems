import { Router } from 'express';
import { createLeave, getLeaves, updateLeaveStatus } from '../controllers/leaveApplicationController.js';
import { protect, protectAdmin } from '../middlewares/auth.js';

const leaveApplicationRouter = Router();

leaveApplicationRouter.post("/", protect, createLeave);
leaveApplicationRouter.get("/", protect, getLeaves);
leaveApplicationRouter.patch("/:id", protect, protectAdmin, updateLeaveStatus);

export default leaveApplicationRouter;