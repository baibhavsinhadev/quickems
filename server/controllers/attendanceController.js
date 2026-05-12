import { inngest } from "../inngest/index.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// POST /api/attendance
export const clockInOut = async (req, res) => {
    try {
        const session = req.session;

        if (!session?.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        if (employee.isDeleted) {
            return res.status(403).json({
                success: false,
                message: "Your account is deactivated. You cannot clock in/out"
            });
        }

        // Normalize today's date (important)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const now = new Date();

        let attendance = await Attendance.findOne({
            employeeId: employee._id,
            date: today
        });

        // ================= CHECK-IN =================
        if (!attendance) {
            const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);

            attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "LATE" : "PRESENT"
            });

            // async trigger (non-blocking)
            inngest.send({
                name: "employee/check-out",
                data: {
                    employeeId: employee._id.toString(),
                    attendanceId: attendance._id.toString()
                }
            }).catch(() => { });

            return res.json({
                success: true,
                type: "CHECK_IN",
                data: attendance
            });
        }

        // ================= CHECK-OUT =================
        if (!attendance.checkOut) {
            const checkInTime = new Date(attendance.checkIn).getTime();
            const diffMs = now.getTime() - checkInTime;

            const workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

            let dayType = "Short Day";
            if (workingHours >= 8) dayType = "Full Day";
            else if (workingHours >= 6) dayType = "Three Quarter Day";
            else if (workingHours >= 4) dayType = "Half Day";

            attendance.checkOut = now;
            attendance.workingHours = workingHours;
            attendance.dayType = dayType;

            await attendance.save();

            return res.json({
                success: true,
                type: "CHECK_OUT",
                data: attendance
            });
        }

        // ================= ALREADY CHECKED OUT =================
        return res.json({
            success: true,
            type: "ALREADY_DONE",
            data: attendance
        });

    } catch (error) {
        console.error("Attendance Error:", error);
        return res.status(500).json({
            success: false,
            message: "Operation Failed"
        });
    }
};

// GET /api/attendance
export const getAttendance = async (req, res) => {
    try {
        const session = req.session;

        if (!session?.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const employee = await Employee.findOne({ userId: session.userId }).lean();

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const limit = parseInt(req.query.limit, 10) || 30;

        const history = await Attendance.find({ employeeId: employee._id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return res.json({
            success: true,
            result: history,
            employee: {
                isDeleted: employee.isDeleted
            }
        });

    } catch (error) {
        console.error("Get Attendance Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance"
        });
    }
};