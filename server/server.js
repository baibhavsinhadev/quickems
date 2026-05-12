import "dotenv/config";

import express from "express";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

import connectDB from "./config/mongoDB.js";

import authRouter from "./routes/authRoutes.js";
import employeesRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import leaveApplicationRouter from "./routes/leaveAttendanceRoutes.js";
import payslipRouter from "./routes/payslipRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// DB Connection
await connectDB();

// Core Middleware
app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));
app.use(multer().none());

// Health Check
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Rate Limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leaves", leaveApplicationRouter);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashboard", dashboardRouter);

// Inngest
app.use("/api/inngest", apiLimiter, serve({ client: inngest, functions }));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error Handler 
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});