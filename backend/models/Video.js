const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["video", "reel"],
      default: "video",
    },
    category: { type: String, trim: true, default: "General" },
    description: { type: String, trim: true, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    cloudinaryId: { type: String, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
