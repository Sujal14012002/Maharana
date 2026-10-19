
const express = require("express");
const router = express.Router();

const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");
const { uploadVideo } = require("../middleware/upload");
const { videoThumbnailUrl } = require("../utils/cloudinaryUrl");

// GET /api/videos?type=reel&category=Wedding
router.get("/", async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = {};

    if (type && type !== "All") {
      filter.type = type;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const videos = await Video.find(filter).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: videos,
    });
  } catch (err) {
    console.error("Get videos error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// POST /api/videos
router.post("/", uploadVideo.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const {
      title,
      type,
      category,
      description,
      featured,
      order,
    } = req.body;

    const video = await Video.create({
      title,
      type: type === "reel" ? "reel" : "video",
      category,
      description,
      featured: featured === "true" || featured === true,
      order: Number(order) || 0,
      videoUrl: req.file.path,
      thumbnailUrl: videoThumbnailUrl(req.file.originalUrl),
      cloudinaryId: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (err) {
    console.error("Video upload error:", err);

    // Remove uploaded Cloudinary file if database save fails
    if (req.file?.filename) {
      await cloudinary.uploader
        .destroy(req.file.filename, {
          resource_type: "video",
        })
        .catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PUT /api/videos/:id
router.put("/:id", uploadVideo.single("video"), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const {
      title,
      type,
      category,
      description,
      featured,
      order,
    } = req.body;

    if (title !== undefined) video.title = title;

    if (type !== undefined) {
      video.type = type === "reel" ? "reel" : "video";
    }

    if (category !== undefined) video.category = category;
    if (description !== undefined) video.description = description;

    if (featured !== undefined) {
      video.featured = featured === "true" || featured === true;
    }

    if (order !== undefined) {
      video.order = Number(order) || 0;
    }

    if (req.file) {
      const oldCloudinaryId = video.cloudinaryId;

      video.videoUrl = req.file.path;
      video.thumbnailUrl = videoThumbnailUrl(req.file.originalUrl);
      video.cloudinaryId = req.file.filename;

      await video.save();

      if (oldCloudinaryId) {
        await cloudinary.uploader
          .destroy(oldCloudinaryId, {
            resource_type: "video",
          })
          .catch(() => {});
      }

      return res.json({
        success: true,
        data: video,
      });
    }

    await video.save();

    res.json({
      success: true,
      data: video,
    });
  } catch (err) {
    console.error("Video update error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE /api/videos/:id
router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (video.cloudinaryId) {
      await cloudinary.uploader
        .destroy(video.cloudinaryId, {
          resource_type: "video",
        })
        .catch(() => {});
    }

    await video.deleteOne();

    res.json({
      success: true,
      message: "Video deleted",
    });
  } catch (err) {
    console.error("Video delete error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
