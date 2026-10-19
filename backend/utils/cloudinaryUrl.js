// Cloudinary can convert media on the fly when the URL contains transformations.
// This makes phone files (HEIC / AVIF / MOV / HEVC) play and show in every browser.

const addTransform = (url, transform) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
};

// Images -> best format for the browser (jpg/webp/avif) + auto quality
const optimizedImageUrl = (url) => addTransform(url, "f_auto,q_auto");

// Videos -> H.264 mp4 (plays everywhere, incl. iPhone recordings) + auto quality
const optimizedVideoUrl = (url) => addTransform(url, "f_mp4,vc_h264,q_auto");

// Poster image taken from the first frame of the video
const videoThumbnailUrl = (url) => {
  const t = addTransform(url, "so_0,f_jpg,q_auto,w_720");
  return t ? t.replace(/\.[a-zA-Z0-9]+$/, ".jpg") : "";
};

module.exports = { optimizedImageUrl, optimizedVideoUrl, videoThumbnailUrl };
