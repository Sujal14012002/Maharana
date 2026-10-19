const jwt = require("jsonwebtoken");
const { getAdminEnv } = require("../config/adminEnv");

// Blocks the request unless a valid admin JWT is sent in
// the "Authorization: Bearer <token>" header.
const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Admin login required" });
  }

  try {
    const payload = jwt.verify(token, getAdminEnv().secret);
    if (payload.role !== "admin") throw new Error("Not admin");
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Session expired. Please login again." });
  }
};

// Protects every method EXCEPT GET (public site can still read content).
const protectWrites = (req, res, next) => {
  if (req.method === "GET" || req.method === "OPTIONS") return next();
  return requireAdmin(req, res, next);
};

module.exports = { requireAdmin, protectWrites };