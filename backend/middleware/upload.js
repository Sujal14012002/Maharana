
const multer = require("multer");
const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");
const { optimizedImageUrl, optimizedVideoUrl } = require("../utils/cloudinaryUrl");

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

// Upload file buffer to Cloudinary
const uploadToCloudinary = (folder, resourceType) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return next(new Error("Cloudinary is not configured on the server (check CLOUDINARY_* env variables)"));
    }

    const file = req.file;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        timeout: 300000,
      },
      (error, result) => {
        if (error) {
          return next(error);
        }

        // Preserve fields commonly used by existing routes
        req.file.path =
          resourceType === "video"
            ? optimizedVideoUrl(result.secure_url)
            : optimizedImageUrl(result.secure_url);
        req.file.originalUrl = result.secure_url;
        req.file.filename = result.public_id;
        req.file.cloudinary = result;

        next();
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  };
};

// Image formats accepted (phones often give jfif / heic / avif)
const IMAGE_TYPES = ["jpg", "jpeg", "jfif", "png", "webp", "heic", "avif", "gif"];

// Allowed file formats
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    const extension = file.originalname
      .split(".")
      .pop()
      .toLowerCase();

    if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format ".${extension}". Allowed: ${allowedTypes.join(", ")}`), false);
    }
  };
};

// Video upload - Maximum 100MB
const videoMulter = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: fileFilter([
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
  ]),
});

// Photo upload - Maximum 10MB
const photoMulter = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter(IMAGE_TYPES),
});

// Frame upload - Maximum 10MB
const frameMulter = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter(IMAGE_TYPES),
});

// Middleware to support existing .single("field") routes
const createUploader = (multerInstance, folder, resourceType) => ({
  single: (fieldName) => [
    multerInstance.single(fieldName),
    uploadToCloudinary(folder, resourceType),
  ],
});

const uploadVideo = createUploader(
  videoMulter,
  "maharana-pratap-studio/videos",
  "video"
);

const uploadPhoto = createUploader(
  photoMulter,
  "maharana-pratap-studio/photos",
  "image"
);

const uploadFrame = createUploader(
  frameMulter,
  "maharana-pratap-studio/frames",
  "image"
);

module.exports = {
  uploadVideo,
  uploadPhoto,
  uploadFrame,
};
