import api from "./axios";

export const getVideos = (params = {}) => api.get("/videos", { params });

export const createVideo = (formData, onUploadProgress) =>
  api.post("/videos", formData, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress });

export const updateVideo = (id, formData, onUploadProgress) =>
  api.put(`/videos/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress });

export const deleteVideo = (id) => api.delete(`/videos/${id}`);
