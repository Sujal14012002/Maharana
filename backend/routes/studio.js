
const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const StudioInfo = require("../models/StudioInfo");
const multer = require("multer");
const { Readable } = require("stream");
const { optimizedImageUrl } = require("../utils/cloudinaryUrl");

// Store uploaded files in memory before uploading to Cloudinary
const storage = multer.memoryStorage();

const uploadBranding = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Only JPG, PNG and WEBP images are allowed"));
  },
});

// Upload image buffer directly to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "maharana-pratap-studio/branding",
      resource_type: "image",
    },
    (error, result) => {
      if (error) {
        return next(error);
      }

      // Keep compatibility with the existing route handlers
      req.file.path = optimizedImageUrl(result.secure_url);
      req.file.filename = result.public_id;

      next();
    }
  );

  Readable.from(req.file.buffer).pipe(uploadStream);
};

// GET /api/studio
// Return existing settings or create default settings
router.get("/", async (req, res) => {
  try {
    let info = await StudioInfo.findOne();

    if (!info) {
      info = await StudioInfo.create({});
    }

    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PUT /api/studio
// Update text fields
router.put("/", async (req, res) => {
  try {
    let info = await StudioInfo.findOne();

    if (!info) {
      info = new StudioInfo();
    }

    // Only these fields may be edited through this route
    const textKeys = [
      "studioName", "tagline", "heroHeadline", "heroSubheadline", "aboutTitle", "aboutContent",
      "address", "phone", "whatsapp", "email", "mapEmbedUrl", "instagram", "facebook", "youtube",
      "primaryColor", "accentColor",
    ];
    const numberKeys = ["yearsOfExperience", "projectsCompleted", "happyClients"];

    textKeys.forEach((k) => {
      if (req.body[k] !== undefined && req.body[k] !== null) info[k] = String(req.body[k]);
    });
    numberKeys.forEach((k) => {
      if (req.body[k] !== undefined) info[k] = Number(req.body[k]) || 0;
    });

    await info.save();

    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PUT /api/studio/logo
router.put(
  "/logo",
  uploadBranding.single("logo"),
  uploadToCloudinary,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Logo file is required",
        });
      }

      let info = await StudioInfo.findOne();

      if (!info) {
        info = new StudioInfo();
      }

      if (info.logoCloudinaryId) {
        await cloudinary.uploader
          .destroy(info.logoCloudinaryId)
          .catch(() => {});
      }

      info.logoUrl = req.file.path;
      info.logoCloudinaryId = req.file.filename;

      await info.save();

      res.json({ success: true, data: info });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// PUT /api/studio/hero-image
router.put(
  "/hero-image",
  uploadBranding.single("image"),
  uploadToCloudinary,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      let info = await StudioInfo.findOne();

      if (!info) {
        info = new StudioInfo();
      }

      if (info.heroCloudinaryId) {
        await cloudinary.uploader
          .destroy(info.heroCloudinaryId)
          .catch(() => {});
      }

      info.heroImageUrl = req.file.path;
      info.heroCloudinaryId = req.file.filename;

      await info.save();

      res.json({ success: true, data: info });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// PUT /api/studio/about-image
router.put(
  "/about-image",
  uploadBranding.single("image"),
  uploadToCloudinary,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      let info = await StudioInfo.findOne();

      if (!info) {
        info = new StudioInfo();
      }

      if (info.aboutCloudinaryId) {
        await cloudinary.uploader
          .destroy(info.aboutCloudinaryId)
          .catch(() => {});
      }

      info.aboutImageUrl = req.file.path;
      info.aboutCloudinaryId = req.file.filename;

      await info.save();

      res.json({ success: true, data: info });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

module.exports = router;
