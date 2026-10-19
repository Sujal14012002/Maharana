const mongoose = require("mongoose");

const frameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "General" },
    description: { type: String, trim: true, default: "" },
    price: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Frame", frameSchema);
