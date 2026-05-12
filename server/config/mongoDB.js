import mongoose from "mongoose";

const connectDB = async (_, res) => {
    const mongoDBURI = process.env.MONGODB_URI;
    if (!mongoDBURI) {
        res.json({ success: false, message: "Server Error" });
        console.error("MONGODB_URI Not Found");
    }

    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected Successfully");
        });

        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error(`Database connected failed: ${error}`);
    };
};

export default connectDB;