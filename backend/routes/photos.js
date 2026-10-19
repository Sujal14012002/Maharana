const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const Photo = require("../models/Photo");
const { uploadPhoto } = require("../middleware/upload");

// GET /api/photos?category=Wedding
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const photos = await Photo.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: photos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/photos/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Photo.distinct("category");
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/photos  (admin)
router.post("/", uploadPhoto.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }
    const { title, category, description, featured, order } = req.body;
    if (!title || !category) {
      await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
      return res.status(400).json({ success: false, message: "Title and category are required" });
    }
    const photo = await Photo.create({
      title,
      category,
      description,
      featured: featured === "true" || featured === true,
      order: order ? Number(order) : 0,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
    });
    res.status(201).json({ success: true, data: photo });
  } catch (err) {
    if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/photos/:id  (admin)
router.put("/:id", uploadPhoto.single("image"), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });

    const { title, category, description, featured, order } = req.body;
    if (title !== undefined) photo.title = title;
    if (category !== undefined) photo.category = category;
    if (description !== undefined) photo.description = description;
    if (featured !== undefined) photo.featured = featured === "true" || featured === true;
    if (order !== undefined) photo.order = Number(order) || 0;

    if (req.file) {
      if (photo.cloudinaryId) await cloudinary.uploader.destroy(photo.cloudinaryId).catch(() => {});
      photo.imageUrl = req.file.path;
      photo.cloudinaryId = req.file.filename;
    }

    await photo.save();
    res.json({ success: true, data: photo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/photos/:id  (admin)
router.delete("/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });
    if (photo.cloudinaryId) await cloudinary.uploader.destroy(photo.cloudinaryId).catch(() => {});
    await photo.deleteOne();
    res.json({ success: true, message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
