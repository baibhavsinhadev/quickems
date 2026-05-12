import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Get Employees
// GET /api/employees
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;

        const filter = {};
        if (department) filter.department = department;

        const employees = await Employee.find(filter).sort({ createdAt: -1 }).populate("userId", "email role").lean();

        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId
                ? {
                    email: emp.userId.email,
                    role: emp.userId.role,
                }
                : null,
        }));

        return res.json({ success: true, result });
    } catch (error) {
        console.error("GET EMPLOYEES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch employees",
        });
    }
};

// Create Employee
// POST /api/employees
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, joinDate, password, role, bio } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ success: false, message: "Missing Required Fields" });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            role: role || "EMPLOYEE"
        });

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio: bio || ""
        });

        return res.status(201).json({ success: true, employee });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email Already Exists" })
        };

        console.error("Create employee error: ", error);
        return res.status(500).json({ success: false, message: "Failed to create employee" });
    };
};

// Update Employee
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, password, role, bio, employmentStatus } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        await Employee.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employmentStatus: employmentStatus || "ACTIVE",
            bio: bio || ""
        });

        const userUpdate = { email };
        if (role) userUpdate = role;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);

        await user.findByIdAndUpdate(employee.userId, userUpdate);
        return res.json({ success: true });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email Already Exists" });
        }

        console.error("Update employee error:", error);
        res.status(500).json({ success: false, message: "Failed to update employee" });
    };
};

// Delete Employee
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE";
        await employee.save();

        return res.json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Delete employee error:", error);
        res.status(500).json({ success: false, message: "Failed to delete employee" });
    };
};