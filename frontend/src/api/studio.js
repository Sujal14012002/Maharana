import api from "./axios";

export const getStudioInfo = () => api.get("/studio");

export const updateStudioInfo = (payload) => api.put("/studio", payload);

export const updateLogo = (formData) =>
  api.put("/studio/logo", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateHeroImage = (formData) =>
  api.put("/studio/hero-image", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateAboutImage = (formData) =>
  api.put("/studio/about-image", formData, { headers: { "Content-Type": "multipart/form-data" } });
