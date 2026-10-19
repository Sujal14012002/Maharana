// Shrinks big phone photos in the browser BEFORE upload so they never fail the
// 10MB limit and upload fast on mobile data. Falls back to the original file
// if the browser cannot decode it (e.g. HEIC on Chrome) — the server handles it.
export async function compressImage(file, maxSize = 2400, quality = 0.88) {
  try {
    if (!file || !file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
    if (file.size < 1.2 * 1024 * 1024) return file; // already small

    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);

    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch (e) {
    return file;
  }
}

export const formatSize = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
