import api from "./axios";

export const submitEnquiry = (payload) => api.post("/enquiries", payload);

export const getEnquiries = (status) =>
  api.get("/enquiries", { params: status && status !== "All" ? { status } : {} });

export const updateEnquiryStatus = (id, status) => api.put(`/enquiries/${id}`, { status });

export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);
