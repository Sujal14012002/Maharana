import api from "./axios";

export const loginAdmin = (username, password) => api.post("/auth/login", { username, password });

export const checkAdmin = () => api.get("/auth/me");
