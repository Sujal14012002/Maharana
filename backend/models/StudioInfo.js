const mongoose = require("mongoose");

// Single-document collection holding all editable studio content:
// logo, about text, contact details, social links, theme colors, hero content.
const studioInfoSchema = new mongoose.Schema(
  {
    studioName: { type: String, default: "Maharana Pratap Studio" },
    tagline: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    logoCloudinaryId: { type: String, default: "" },

    heroHeadline: { type: String, default: "" },
    heroSubheadline: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    heroCloudinaryId: { type: String, default: "" },

    aboutTitle: { type: String, default: "About the Studio" },
    aboutContent: { type: String, default: "" },
    aboutImageUrl: { type: String, default: "" },
    aboutCloudinaryId: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    happyClients: { type: Number, default: 0 },

    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },

    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },

    primaryColor: { type: String, default: "#7A1F2B" },
    accentColor: { type: String, default: "#C9A227" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudioInfo", studioInfoSchema);
