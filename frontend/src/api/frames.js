import api from "./axios";

export const getFrames = (category) =>
  api.get("/frames", { params: category && category !== "All" ? { category } : {} });

export const createFrame = (formData, onUploadProgress) =>
  api.post("/frames", formData, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress });

export const updateFrame = (id, formData, onUploadProgress) =>
  api.put(`/frames/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress });

export const deleteFrame = (id) => api.delete(`/frames/${id}`);
