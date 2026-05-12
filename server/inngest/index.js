import { Inngest } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "employee-management-system" });

// Auto Check-out for employees
const autoCheckOut = inngest.createFunction(
    {
        id: "auto-check-out",
        triggers: {
            event: "employee/check-out"
        }
    },
    async ({ event, step }) => {
        const { employeeId, attendanceId } = event.data;

        // Wait for 9 hours
        await step.sleepUntil(
            "wait-for-9-hours",
            new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        );

        // Get Attendance Data
        let attendance = await Attendance.findById(attendanceId);
        if (!attendance) return;
        if (attendance.checkOut) return;

        if (!attendance?.checkOut) {
            // Get Employee Data
            const employee = await Employee.findById(employeeId);

            // Send reminder email
            await sendEmail({
                to: employee.email,
                subject: "Attendance Check-Out Reminder",
                body: `
                    <div style="background:#f8fafc;padding:40px 0;font-family:Outfit,Arial,sans-serif;">
                        <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid rgba(148,163,184,0.2);overflow:hidden;">
                            <div style="padding:24px 28px;border-bottom:1px solid #f1f5f9;">
                                <h2 style="margin:0;font-size:20px;color:#0f172a;font-weight:600;">Attendance Reminder</h2>
                                <p style="margin:6px 0 0;font-size:13px;color:#64748b;">Employee Management System</p>
                            </div>
                            
                            <div style="padding:24px 28px;">
                                <p style="font-size:14px;color:#334155;margin:0 0 12px;">Hi,</p>
                                <p style="font-size:14px;color:#334155;margin:0 0 16px;">You have not checked out for today. Please complete your attendance before the system auto check-out.</p>

                                <div style="display:inline-block;padding:6px 10px;border-radius:6px;font-size:12px;background:#fef3c7;color:#92400e;margin-bottom:16px;">Pending Check-Out</div>

                                <p style="font-size:13px;color:#64748b;margin:0 0 20px;">If no action is taken, your attendance will be marked automatically as <b>LATE</b>.</p>

                                <a href="${process.env.CLIENT_URL}" style="display:inline-block;background:linear-gradient(to right,#4f46e5,#6366f1);color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:500;">Check Out Now</a>
                            </div>

                            <div style="padding:18px 28px;background:#f8fafc;border-top:1px solid #f1f5f9;">
                                <p style="font-size:12px;color:#94a3b8;margin:0;">This is an automated message. Please do not reply.</p>
                            </div>
                        </div>
                    </div>
                `
            })

            // After 10 hours, mark attendance as checked out with status "LATE"
            await step.sleepUntil(
                "wait-for-1-hour",
                new Date(Date.now() + 1 * 60 * 60 * 1000)
            );

            attendance = await Attendance.findById(attendanceId);
            if (!attendance || attendance.checkOut) return;

            // Auto checkout logic
            const checkInTime = new Date(attendance.checkIn);

            // Set checkout = checkIn + 10 hours
            const checkOutTime = new Date(checkInTime.getTime() + 10 * 60 * 60 * 1000);
            attendance.checkOut = checkOutTime;

            // Calculate working hours
            const workingHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
            attendance.workingHours = workingHours;

            // Decide day type
            if (workingHours >= 8) {
                attendance.dayType = "Full Day";
            } else if (workingHours >= 6) {
                attendance.dayType = "Three Quarter Day";
            } else if (workingHours >= 4) {
                attendance.dayType = "Half Day";
            } else {
                attendance.dayType = "Short Day";
            }

            // Mark late since auto checkout
            attendance.status = "LATE";
            await attendance.save();
        };
    }
);

// Send Email to admin, If admin doesn't take action on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
    {
        id: "leave-application-reminder",
        triggers: {
            event: "leave/application.created"
        }
    },
    async ({ event, step }) => {
        const { leaveApplicationId } = event.data;

        // Wait 24 hours
        await step.sleepUntil(
            "wait-for-the-24-hours",
            new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        );

        const leaveApplication = await LeaveApplication.findById(leaveApplicationId);
        if (leaveApplication?.status === "PENDING") {
            const employee = await Employee.findById(leaveApplication.employeeId);

            // Send reminder email to admin to take action on leave application
            await sendEmail({
                to: process.env.ADMIN_EMAIL,
                subject: "Leave Application Reminder",
                body: `
                    <div style="background:#f8fafc;padding:40px 0;font-family:Arial,sans-serif;">
                        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;">
                            <div style="padding:20px;border-bottom:1px solid #f1f5f9;">
                                <h2 style="margin:0;color:#0f172a;">Leave Approval Pending</h2>
                            </div>

                            <div style="padding:20px;">
                                <p>A leave request is still pending for approval.</p>

                                <a href="${process.env.CLIENT_URL}"
                                   style="background:#4f46e5;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
                                   Review Now
                                </a>
                            </div>

                            <div style="padding:15px;background:#f8fafc;font-size:12px;color:#64748b;">
                                Auto reminder after 24 hours
                            </div>
                        </div>
                    </div>
                `
            })
        };
    }
);

// Cron: Check attendance at 11:30 AM IST (06:00 UTC) & email absent employees
const attendanceReminderCron = inngest.createFunction(
    {
        id: "attendance-reminder-cron",
        triggers: {
            cron: "0 6 * * *" // 06:00 UTC = 11:30 AM IST
        }
    },
    async ({ step }) => {
        // Step 1: Get today's date range (IST)
        const today = new step.run("get-today-date", () => {
            const startUTC = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00+05:30");
            const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);

            return {
                startUTC: startUTC.toISOString(),
                endUTC: endUTC.toISOString()
            };
        });

        // Step 2: Get all active, non-deleted employees
        const activeEmployees = await step.run("get-active-employees", async () => {
            const employees = await Employee.find({
                employmentStatus: "ACTIVE",
                isDeleted: false
            }).lean();

            return employees.map((employee) => ({
                _id: employee._id.toString(),
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                department: employee.department
            }));
        });

        // Step 3: Get employee IDs on approved leave today
        const onLeaveIds = await step.run("get-on-leave-ids", async () => {
            const leaves = await LeaveApplication.find({
                status: "APPROVED",
                startDate: { $lte: new Date(today.endUTC) },
                endDate: { $gte: new Date(today.startUTC) }
            }).lean();

            return leaves.map((leave) => leave.employeeId.toString());
        });

        // Step 4: Get employee Ids who already checked in today
        const checkedInIds = await step.run("get-checked-in-ids", async () => {
            const attendances = await Attendance.find({
                date: {
                    $gte: new Date(today.startUTC),
                    $lt: new Date(today.endUTC)
                }
            }).lean();

            return attendances.map((attendance) => attendance.employeeId.toString());
        });

        // Step 5: Filter absent employees (not on leave & not checked in)
        const absentEmployees = activeEmployees.filter((employee) => !onLeaveIds.includes(employee._id) && !checkedInIds.includes(employee._id));

        // Step 6: Send reminder emails
        if (absentEmployees.length > 0) {
            await step.run("send-reminder-emails", async () => {
                const emailPromises = absentEmployees.map((employee) => {
                    sendEmail({
                        to: employee.email,
                        subject: "Attendance Reminder - Please Mark Your Attendance",
                        body: `
                            <div style="background:#f8fafc;padding:40px 0;font-family:Arial,sans-serif;">
                                <div style="max-width:520px;margin:auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;">
                                    <div style="padding:20px;border-bottom:1px solid #f1f5f9;">
                                        <h2 style="margin:0;color:#0f172a;">Attendance Reminder</h2>
                                    </div>

                                    <div style="padding:20px;">
                                        <p>Hi ${employee.firstName},</p>
                                        <p>You have not checked in today.</p>

                                        <div style="display:inline-block;padding:6px 10px;background:#fef3c7;color:#92400e;border-radius:6px;">
                                            Absent Today
                                        </div>

                                        <br/><br/>
                                        
                                        <a href="${process.env.CLIENT_URL}" style="background:#4f46e5;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
                                            Mark Attendance
                                        </a>
                                    </div>

                                    <div style="padding:15px;background:#f8fafc;font-size:12px;color:#64748b;">
                                        This is an automated reminder
                                    </div>
                                </div>
                            </div>
                        `
                    })
                });
            });
        };

        return {
            totalActive: activeEmployees.length,
            onLeave: onLeaveIds.length,
            checkedIn: checkedInIds.length,
            absent: absentEmployees.length
        };
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
    autoCheckOut,
    leaveApplicationReminder,
    attendanceReminderCron
];