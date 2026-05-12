import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import User from "./models/User.js";
import bcrypt from 'bcrypt';

const TEMP_PASSWORD = "admin123";

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        if (!ADMIN_EMAIL) {
            console.error("Missing ADMIN_EMAIL env variable");
            process.exit(1);
        };

        await connectDB();

        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log("User already exists as role", existingAdmin.role);
            process.exit(0);
        };

        const hashedPassword = await bcrypt.hash(TEMP_PASSWORD, 10);
        const admin = await User.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log("Admin created successfully");
        console.log("Email:", ADMIN_EMAIL);
        console.log("Temporary Password:", TEMP_PASSWORD);
        console.log("Change the password after login");

        process.exit(0);
    } catch (error) {
        console.log("Error creating admin: ", process.exit(1))
        process.exit(1);
    };
};

registerAdmin();