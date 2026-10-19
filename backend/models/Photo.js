const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", photoSchema);
