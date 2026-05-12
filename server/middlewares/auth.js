import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized - No Token" });
        }

        const token = authHeader.split(" ")[1];

        const session = jwt.verify(token, process.env.JWT_SECRET);

        if (!session?.userId) {
            return res.status(401).json({ success: false, message: "Invalid Token Data" });
        }

        req.session = session;

        next();
    } catch (error) {
        console.log("AUTH ERROR:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized - Token Failed" });
    }
};

export const protectAdmin = (req, res, next) => {
    if (req?.session?.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Admin Access Required" })
    };

    next();
};