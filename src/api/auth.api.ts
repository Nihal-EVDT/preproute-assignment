import api from "./axios";

export const loginApi = (data: { userId: string; password: string }) =>
  api.post("/auth/login", data);
