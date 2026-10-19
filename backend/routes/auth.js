const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// ---- very small in-memory brute-force limiter: 8 tries / 15 min / IP ----
const attempts = new Map();
const WINDOW = 15 * 60 * 1000;
const MAX = 8;

const tooMany = (ip) => {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.start > WINDOW) return false;
  return rec.count >= MAX;
};
const fail = (ip) => {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.start > WINDOW) attempts.set(ip, { start: now, count: 1 });
  else rec.count += 1;
};

const safeEqual = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Server is missing ADMIN_USERNAME / ADMIN_PASSWORD / JWT_SECRET",
    });
  }

  const ip = req.ip;
  if (tooMany(ip)) {
    return res.status(429).json({ success: false, message: "Too many attempts. Try again in 15 minutes." });
  }

  const { username, password } = req.body || {};
  const ok =
    username && password && safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);

  if (!ok) {
    fail(ip);
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ success: true, token });
});

// GET /api/auth/me  -> used by the frontend to check the token is still valid
router.get("/me", requireAdmin, (req, res) => {
  res.json({ success: true, role: "admin" });
});

module.exports = router;
