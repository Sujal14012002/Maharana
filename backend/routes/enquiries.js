const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");

// Anti-spam: max 5 enquiries per hour from one IP (in-memory)
const sent = new Map();
const HOUR = 60 * 60 * 1000;
const limited = (ip) => {
  const now = Date.now();
  const list = (sent.get(ip) || []).filter((t) => now - t < HOUR);
  if (list.length >= 5) { sent.set(ip, list); return true; }
  list.push(now);
  sent.set(ip, list);
  return false;
};

// GET /api/enquiries  (admin listing)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "All" ? { status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/enquiries  (public enquiry form)
router.post("/", async (req, res) => {
  try {
    const { name, contactNumber, description } = req.body;
    if (limited(req.ip)) {
      return res.status(429).json({ success: false, message: "Too many enquiries. Please try again later." });
    }
    if (!name || !contactNumber || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, contact number and description are required",
      });
    }
    if (String(name).length > 100 || String(contactNumber).length > 30 || String(description).length > 3000) {
      return res.status(400).json({ success: false, message: "One of the fields is too long" });
    }
    const enquiry = await Enquiry.create({
      name: String(name),
      contactNumber: String(contactNumber),
      description: String(description),
    });
    res.status(201).json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/enquiries/:id  (update status)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/enquiries/:id
router.delete("/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, message: "Enquiry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
