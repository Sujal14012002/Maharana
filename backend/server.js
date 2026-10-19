require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const photoRoutes = require("./routes/photos");
const videoRoutes = require("./routes/videos");
const frameRoutes = require("./routes/frames");
const enquiryRoutes = require("./routes/enquiries");
const studioRoutes = require("./routes/studio");
const authRoutes = require("./routes/auth");
const { requireAdmin, protectWrites } = require("./middleware/auth");

const app = express();

// ======================================================
// DATABASE
// ======================================================

connectDB();

// ======================================================
// MIDDLEWARE
// ======================================================

// Needed on Render/Railway/etc. so req.ip is the real client IP
app.set("trust proxy", 1);

// CLIENT_ORIGIN can be one URL or several separated by commas
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Maharana Pratap Studio API is running",
  });
});

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

// Public can READ (GET). Only a logged-in admin can add / edit / delete.
app.use("/api/photos", protectWrites, photoRoutes);
app.use("/api/videos", protectWrites, videoRoutes);
app.use("/api/frames", protectWrites, frameRoutes);
app.use("/api/studio", protectWrites, studioRoutes);

// Enquiries: anyone can SUBMIT (POST), only admin can view / update / delete
app.use(
  "/api/enquiries",
  (req, res, next) => (req.method === "POST" ? next() : requireAdmin(req, res, next)),
  enquiryRoutes
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  // Upload problems (file too big / wrong format) are the user's fault -> 400
  if (err.name === "MulterError" || /Unsupported file format|Only JPG/.test(err.message)) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "File is too large (photos/frames max 10MB, videos max 100MB)" : err.message;
    return res.status(400).json({ success: false, message });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `[Server] Maharana Pratap Studio API running on port ${PORT}`
  );
});