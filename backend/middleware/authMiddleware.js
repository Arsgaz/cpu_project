import jwt from "jsonwebtoken";

// Проверка токена
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Token from header:", token);

  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT error:", err);
    res.status(400).json({ message: "Invalid token" });
  }
};


// Проверка роли администратора
export const verifyAdmin = (req, res, next) => {
  console.log("User role at verifyAdmin:", req.user?.role);
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
