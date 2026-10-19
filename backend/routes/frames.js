const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const Frame = require("../models/Frame");
const { uploadFrame } = require("../middleware/upload");

// GET /api/frames?category=Wooden
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const frames = await Frame.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: frames });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/frames
router.post("/", uploadFrame.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }
    const { title, category, description, price, featured, order } = req.body;
    const frame = await Frame.create({
      title,
      category,
      description,
      price,
      featured: featured === "true" || featured === true,
      order: Number(order) || 0,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
    });
    res.status(201).json({ success: true, data: frame });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/frames/:id
router.put("/:id", uploadFrame.single("image"), async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);
    if (!frame) return res.status(404).json({ success: false, message: "Frame not found" });

    const { title, category, description, price, featured, order } = req.body;
    if (title !== undefined) frame.title = title;
    if (category !== undefined) frame.category = category;
    if (description !== undefined) frame.description = description;
    if (price !== undefined) frame.price = price;
    if (featured !== undefined) frame.featured = featured === "true" || featured === true;
    if (order !== undefined) frame.order = Number(order) || 0;

    if (req.file) {
      await cloudinary.uploader.destroy(frame.cloudinaryId).catch(() => {});
      frame.imageUrl = req.file.path;
      frame.cloudinaryId = req.file.filename;
    }

    await frame.save();
    res.json({ success: true, data: frame });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/frames/:id
router.delete("/:id", async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);
    if (!frame) return res.status(404).json({ success: false, message: "Frame not found" });

    await cloudinary.uploader.destroy(frame.cloudinaryId).catch(() => {});
    await frame.deleteOne();
    res.json({ success: true, message: "Frame deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
